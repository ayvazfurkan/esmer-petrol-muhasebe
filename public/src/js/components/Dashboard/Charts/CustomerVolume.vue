<script>
import { PolarArea } from 'vue-chartjs'
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  extends: PolarArea,
  mounted () {
    this.get()
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  methods: {
    get () {
      ipcRenderer.send('/chart/customerVolume', { branchId: this.getSession.userDetails.branchId })
      new Promise(function (resolve) {
        ipcRenderer.on('chartCustomerVolume', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        const labels = _.map(response, 'customer')
        const data = _.map(response, 'total')
        this.render(labels, data)
      })
    },
    render (labels, data) {
      this.renderChart(
        {
          labels,
          datasets: [
            {
              backgroundColor: ['rgba(48,63,159,0.65)', 'rgba(255,176,0,0.65)', 'rgba(0,121,107,0.65)', 'rgba(237,66,144,0.65)', 'rgba(75,192,192,0.65)', 'rgba(12,156,235,0.66)'],
              data,
              barPercentage: 0.2
            }
          ]
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                gridLines: {
                  drawBorder: false,
                  drawOnChartArea: false,
                  color: 'rgba(0, 0, 0, 0)',
                  lineWidth: 0
                },
                ticks: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  drawBorder: false,
                  drawOnChartArea: false,
                  color: 'rgba(0, 0, 0, 0)',
                  lineWidth: 0
                },
                ticks: {
                  display: false
                }
              }
            ]
          },
          title: {
            display: false
          },
          legend: {
            display: true,
            position: 'left',
            labels: {
              fontSize: 11,
              usePointStyle: true
            }
          },
          barPercentage: 0.5
        }
      )
    }
  }
}
</script>
