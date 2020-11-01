<script>
import { Line } from 'vue-chartjs'
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'
import _ from 'lodash'
import moment from 'moment'

export default {
  extends: Line,
  data () {
    return {
      labels: [],
      data: [],
      interval: 6
    }
  },
  mounted () {
    this.get()
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  methods: {
    get () {
      ipcRenderer.send('/chart/summaryPeriodic', {
        branchId: this.getSession.userDetails.branchId,
        interval: this.interval
      })
      new Promise(function (resolve) {
        ipcRenderer.on('chartSummaryPeriodic', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        const data = this.fillEmpty(response)
        const labels = _.map(data, 'date')
        const total = _.map(data, 'total')
        this.render(labels, total)
        this.fillEmpty(response)
      })
    },
    render (labels, data) {
      this.renderChart({
        labels: labels,
        datasets: [
          {
            label: 'Toplam Veresiye Satış ₺',
            data: data,
            backgroundColor: 'rgba(0,0,0,0)',
            pointBackgroundColor: 'rgba(237, 66, 144, 0.65)',
            borderColor: 'rgba(237, 66, 144, 0.65)',
            pointRadius: 1,
            pointHoverRadius: 8
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawBorder: true,
                drawOnChartArea: true,
                color: 'rgba(0, 0, 0, 1)',
                lineWidth: 0
              },
              ticks: {
                display: true
              }
            }],
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                drawOnChartArea: false,
                color: 'rgba(0, 0, 0, 0)',
                lineWidth: 0
              },
              ticks: {
                display: false,
                beginAtZero: true
              }
            }]
        },
        elements: {
          point: {
            pointStyle: 'circle'
          }
        },
        legend: {
          display: false
        }
      }
      )
    },
    fillEmpty (response) {
      const dates = []
      for (let i = this.interval; i >= 0; i--) {
        const date = moment().subtract(i, 'days').format('DD.MM.YYYY')
        let getTotal
        for (const data of response) {
          if (moment(data.date).format('DD.MM.YYYY') === date) {
            getTotal = data.total
            break
          }
        }
        dates.push({
          date: date,
          total: getTotal || 0
        })
      }
      return dates
    }
  }
}
</script>
