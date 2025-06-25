<template>
  <div>
    <h2>申請承認（総務）</h2>
    <!-- <div v-for="req in requests" :key="req.id" class="approval-item">
      <p>{{ req.user }} - {{ req.type }}</p>
      <button @click="approve(req)">承認</button>
      <button @click="reject(req)">却下</button>
    </div> -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Atten',
  data() {
    
    return {
      userid: 1,
      attendance: {},
      request: {},
      
      status:["申請中","承認済み","拒否"],
      inflag:false,
      outflag:false
    }
  },
  created(){
    this.fetchattreq();
  },
  methods: {
    
    fetchattall() {

      axios.get(`http://localhost:8080/admin/attendance`)
        .then(res => {
          this.attendance = res.data;
          
console.log(res);
console.log(this.attendance);

          
    
        });
    },

    fetchreqall() {
      axios.get(`http://localhost:8080/application`)
        .then(res => {
          this.request = res.data;
          console.log("Request:", this.request);
        });
    },
   
  
  }

}
</script>
