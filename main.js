// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  props: ['items', 'columns', 'filterKey', 'filterBy'],
  data: function () {
    var sortOrders = {}
    for (var name in this.columns) {
      var key = this.columns[name]
      sortOrders[key] = 0
    }
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filtered: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey]
      var items = this.items
      if (filterKey) {
        items = items.filter((row) =>
          this.filterBy.some((key) => 
            String(this.getValue(row, key)).toLowerCase().indexOf(filterKey) > -1 
          )
        )
      }
      if (sortKey) {
        items = items.slice().sort((a, b) => {
          a = this.getValue(a, sortKey)
          b = this.getValue(b, sortKey)
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return items
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = (this.sortOrders[key] + 2) % 3 - 1
      console.log(this.sortKey,
        this.sortOrders)
    },
    getValue: function (obj, strKey) {
      var keys = strKey.split('.')
      var res = obj
      for (var key of keys) {
        res = res[key]
      }
      return res;
    }
  }
})

// A resusable polygon graph component
Vue.component('graph', {
  props: ['stats', 'size'],
  template: '#polygraph-template'
})

var app = new Vue({
  el: '#app',
  data: {
    searchQuery: '',
    filterBy: ['user.id', 'transaction.project.name'],
    columns: {
      'Имя проект': 'transaction.project.name', 
      'Способ оплаты': 'transaction.payment_method.name', 
      'Дата': 'transaction.transfer_date',
      'Пользователь': 'user.id'
    },
    items: DATA,
    projects: DATA.map(obj => obj.transaction.project.name)
                  .filter((name, i, arr) => arr.indexOf(name) == i),
    paymentRating:  DATA.map(obj => obj.transaction.payment_method.name)
                        .reduce((res, elem) => {
                          res.total++
                          elem in res ? res[elem]++ : res[elem] = 1
                          return res
                        }, {total: 0})
  },
  computed: {
    sortedRating: function() {
      var unordered = this.paymentRating
      var total = unordered.total
      delete unordered['total']
      var ordered = Object.keys(unordered).map(key => {return {"name": key, "rate": unordered[key]/total}});
      ordered.sort((a, b) => b.rate - a.rate)
      return ordered
    }
  }
})