<template>
    <div id="site-uptime">
      <span class="title">UptimeRobot Monitors</span>
      <ul v-if="monitors.length">
        <li v-for="monitor in monitors" :key="monitor.id">
          {{ monitor.friendly_name }} - {{ getStatusText(monitor.status) }}
        </li>
      </ul>
      <p v-else>No data available.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        monitors: []
      };
    },
    methods: {
      fetchData() {
        const apiKey = 'ur1457774-a121d05caa159faf64a74111'; // 替换为你的实际 API 密钥
        const data = `api_key=${apiKey}&format=json&logs=1`;
        axios.post('https://api.uptimerobot.com/v2/getMonitors', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {
          this.monitors = response.data.monitors;
          console.log('site uptime:', this.monitors);
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
      },
      getStatusText(status) {
      switch (status) {
        case 2:
          return 'On';
        case 9:
          return 'Off';
        case 0:
        default:
          return 'Down';
      }
    }
    },
    mounted() {
      this.fetchData();
    }
  };
  </script>
  
  <style>
  #site-uptime {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: 10px;
  }

  .title {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 20px;
    display: block;
  }

  ul {
    width: 100%;
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  li {
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px;
    border-style: solid;
    border-radius: 5px;
    padding: 5px;
  }
  </style>
  