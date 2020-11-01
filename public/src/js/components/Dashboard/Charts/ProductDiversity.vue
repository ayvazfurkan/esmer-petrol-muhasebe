<script>
import { Bar } from 'vue-chartjs'
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'
import _ from 'lodash'

export default {
  extends: Bar,
  mounted () {
    this.get()
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  methods: {
    get () {
      ipcRenderer.send('/chart/product', { branchId: this.getSession.userDetails.branchId })
      new Promise(function (resolve) {
        ipcRenderer.on('chartProduct', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        const labels = _.map(response, 'product')
        const data = _.map(response, 'total')
        this.render(labels, data)
      })
    },
    render (labels, data) {
      this.renderChart(
        {
          labels: labels,
          datasets: [
            {
              label: 'Toplam Veresiye Satış ₺',
              backgroundColor: ['rgba(48,63,159,0.65)', 'rgba(255,176,0,0.65)', 'rgba(0,121,107,0.65)', 'rgba(237,66,144,0.65)', 'rgba(75,192,192,0.65)', 'rgba(12,156,235,0.66)'],
              data: data,
              barPercentage: 0.5
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
                  drawBorder: true,
                  drawOnChartArea: true,
                  color: 'rgba(0, 0, 0, 0)',
                  lineWidth: 0
                },
                ticks: {
                  display: true
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  drawBorder: true,
                  drawOnChartArea: true,
                  color: 'rgba(0, 0, 0, 0)',
                  lineWidth: 0
                },
                ticks: {
                  display: true,
                  beginAtZero: true
                }
              }
            ]
          },
          title: {
            display: false
          },
          legend: {
            display: false
          },
          barPercentage: 0.5
        }
      )
    }
  }
}
</script>
