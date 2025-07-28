<template>
  <div class="container">

    <h2 class="title">Charger Listing Dashboard</h2>
    <!-- Filters -->
<div class="filters">
  <input
    v-model="filters.search"
    type="text"
    placeholder="Search by name..."
    class="search-input"
  />

  <select v-model="filters.status">
    <option value="">All Status</option>
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </select>

  <input
    v-model.number="filters.powerOutput"
    type="number"
    placeholder="Min Power Output (kW)"
  />

 <select v-model="filters.connectorType">
  <option value="">All Connectors</option>
  <option
    v-for="type in connectorTypes"
    :key="type"
    :value="type"
  >
    {{ type }}
  </option>
</select>

</div>


    <!-- Add/Edit Charger Form -->
    <form @submit.prevent="saveCharger" class="form-box">
      <div class="form-grid">
        <input v-model="form.name" type="text" placeholder="Name" required />
        <input v-model="form.status" type="text" placeholder="Status" required />
        <input v-model="form.powerOutput" type="number" placeholder="Power Output (kW)" required />
        <input v-model="form.connectorType" type="text" placeholder="Connector Type" required />
      </div>
      <button type="submit" class="submit-btn">Add Charger</button>
       <button  @click="for10Sec" class="">
        
        {{isDisabled ? `Please wait ${counter} seconds` : 'Add Charger' }}

      </button>
    </form>

    <!-- Table -->
    <table class="charger-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Power Output</th>
          <th>Connector</th>
          <th>Actions</th>
        </tr>
      </thead>
        <tbody>
         <tr v-for="charger in filteredChargers" :key="charger._id">

            <td>{{ charger.name }}</td>
            <td>{{ charger.status }}</td>
            <td>{{ charger.powerOutput }} kW</td>
            <td>{{ charger.connectorType }}</td>
            <td>
              <button @click="editCharger(charger)" class="edit-btn">Edit</button>
              <button @click="deleteCharger(charger._id)" class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
    </table>
  </div>
  <div class="mapContainer">
    <div class="map">
      <Map />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Map from './Map.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
const isDisable=ref(false)
const counter=ref(10)

let interval

const filters = ref({
  search: '',
  status: '',
  powerOutput: '',
  connectorType: ''
})

function for10Sec () {
  
 isDisable.value=true
 counter.value=10
 interval=setInterval(()=>{
   counter.value--
   if(counter.value===0){
     isDisable.value=false
     clearInterval(interval)  }},10000)

}

const filteredChargers = computed(() => {
  return chargers.value.filter(charger => {
    const nameMatch =
      !filters.value.search ||
      charger.name?.toLowerCase().includes(filters.value.search.toLowerCase());

    const statusMatch =
      !filters.value.status || charger.status === filters.value.status;

    const powerMatch =
      !filters.value.powerOutput || charger.powerOutput >= filters.value.powerOutput;

    const connectorMatch =
      !filters.value.connectorType || charger.connectorType === filters.value.connectorType;

    return nameMatch && statusMatch && powerMatch && connectorMatch;
  })
});
const connectorTypes = computed(() => {
  const types = chargers.value
    .map(charger => charger.connectorType)
    .filter(type => !!type); // filter out null/undefined

  return [...new Set(types)];
});


const router = useRouter();

const chargers = ref([])
const isEditing = ref(false)

const form = ref({
  _id: null,
  name: '',
  status: '',
  powerOutput: '',
  connectorType: '',
  location: {
    latitude: null,
    longitude: null
  }
})

// Get user's location
navigator.geolocation.getCurrentPosition((position) => {
  form.value.location.latitude = position.coords.latitude
  form.value.location.longitude = position.coords.longitude
})

// Fetch chargers
const getChargers = async () => {
  try {
      const res = await axios.get('https://chargingstation-backend-td8a.onrender.com/api/stations/',{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  chargers.value = res.data
  } catch (error) {
    alert('please login to see the chargers')
    router.push('/');
    
  }

}

onMounted(getChargers)

const saveCharger = async () => {
  if (isEditing.value) {
    await axios.put(`https://chargingstation-backend-td8a.onrender.com/api/stations/${form.value._id}`, form.value,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  } else {
    await axios.post('https://chargingstation-backend-td8a.onrender.com/api/stations/createStation', form.value,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  }
  resetForm()
  getChargers()
}

const editCharger = (charger) => {
  form.value = { ...charger }
  isEditing.value = true
}

const deleteCharger = async (id) => {
  await axios.delete(`https://chargingstation-backend-td8a.onrender.com/api/stations/${id}`,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  getChargers()
}

const resetForm = () => {
  form.value = {
    _id: null,
    name: '',
    status: '',
    powerOutput: '',
    connectorType: '',
    location: {
      latitude: null,
      longitude: null
    }
  }
  isEditing.value = false
}
</script>

<style>
.mapContainer{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 100%;
  margin-top: 20px;
}
.map{
  width: 60%;
  height: 400px;
  background-color: #e0e0e0;
  margin-bottom: 50px;

  margin-top: 20px;
}
.container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-box {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.filters input,
.filters select {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}


.form-grid input {
  flex: 1 1 200px;
  padding: 8px;
  border: 1px solid #aaa;
  border-radius: 4px;
}

.submit-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.charger-table {
  width: 100%;
  border-collapse: collapse;
}

.charger-table th,
.charger-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.edit-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 3px;
  cursor: pointer;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}
</style>
