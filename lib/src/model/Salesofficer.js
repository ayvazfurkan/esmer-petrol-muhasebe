import Database from './Database'
import _ from 'lodash'
import moment from 'moment'

export default class Salesofficer {
  constructor () {
    const dbObj = new Database()
    this.db = dbObj.connect()
  }

  get (form) {
    return this.db('salesofficer')
      .select('*')
      .where('branchId', form.branchId.toString())
      .where('isDeleted', 0)
  }

  create (form) {
    return this.db('salesofficer').insert(form)
  }

  update (form) {
    let data
    const q = this.db('salesofficer')
    if (!_.isEmpty(form.isDeleted)) {
      data = { isDeleted: form.isDeleted.toString() }
    }
    if (!_.isEmpty(form.form)) {
      data = form.form
    }
    q.where('id', form.id.toString())
    q.update(data)

    return q
  }

  static validateCreate (form) {
    const errors = {}
    if (!form.branchId) {
      errors.general = 'Şube kodu elde edilemedi.'
    }
    if (_.isEmpty(form.name) || form.name.length < 5) {
      errors.name = 'İsim bilgisi boş bırakılamaz ve 5 karakterden küçük olamaz.'
    }
    if (_.isEmpty(form.username) || form.username.length < 5) {
      errors.username = 'Kullanıcı adı bilgisi boş bırakılamaz ve 5 karakterden küçük olamaz.'
    }
    if (!_.isEmpty(form.phone) && form.phone.length < 10) {
      errors.phone = 'Telefon numarası 05XXX ile başlamalı.'
    }
    if (!_.isEmpty(form.phone) && form.phone.length > 11) {
      errors.phone = 'Telefon numarası en fazla 11 karakter olabilir.'
    }
    return {
      status: Object.keys(errors).length !== 0,
      errors
    }
  }

  static validateUpdate (form) {
    const errors = {}
    if (!form.id) {
      errors.general = form.id
    }
    if (_.isEmpty(form.form.name) || form.form.name.length < 5) {
      errors.name = 'Bu alan boş bırakılamaz ve 5 karakterden küçük olamaz.'
    }
    if (_.isEmpty(form.form.username) || form.form.username.length < 5) {
      errors.username = 'Kullanıcı adı bilgisi boş bırakılamaz ve 5 karakterden küçük olamaz.'
    }
    if (!_.isEmpty(form.form.phone) && form.form.phone.length < 10) {
      errors.phone = 'Telefon numarası 05XXX ile başlamalı.'
    }
    if (!_.isEmpty(form.form.phone) && form.form.phone.length > 11) {
      errors.phone = 'Telefon numarası en fazla 11 karakter olabilir.'
    }
    return {
      status: Object.keys(errors).length !== 0,
      errors
    }
  }

  static setCreateParams (form) {
    return {
      branchId: form.branchId || '',
      name: (form.name && form.name.trim()) || '',
      username: (form.username && form.username.trim()) || '',
      img: (form.img && form.img.trim()) || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAACHDwAAjA8AAP1SAACBQAAAfXkAAOmLAAA85QAAGcxzPIV3AAAKOWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAEjHnZZ3VFTXFofPvXd6oc0wAlKG3rvAANJ7k15FYZgZYCgDDjM0sSGiAhFFRJoiSFDEgNFQJFZEsRAUVLAHJAgoMRhFVCxvRtaLrqy89/Ly++Osb+2z97n77L3PWhcAkqcvl5cGSwGQyhPwgzyc6RGRUXTsAIABHmCAKQBMVka6X7B7CBDJy82FniFyAl8EAfB6WLwCcNPQM4BOB/+fpFnpfIHomAARm7M5GSwRF4g4JUuQLrbPipgalyxmGCVmvihBEcuJOWGRDT77LLKjmNmpPLaIxTmns1PZYu4V8bZMIUfEiK+ICzO5nCwR3xKxRoowlSviN+LYVA4zAwAUSWwXcFiJIjYRMYkfEuQi4uUA4EgJX3HcVyzgZAvEl3JJS8/hcxMSBXQdli7d1NqaQffkZKVwBALDACYrmcln013SUtOZvBwAFu/8WTLi2tJFRbY0tba0NDQzMv2qUP91829K3NtFehn4uWcQrf+L7a/80hoAYMyJarPziy2uCoDOLQDI3fti0zgAgKSobx3Xv7oPTTwviQJBuo2xcVZWlhGXwzISF/QP/U+Hv6GvvmckPu6P8tBdOfFMYYqALq4bKy0lTcinZ6QzWRy64Z+H+B8H/nUeBkGceA6fwxNFhImmjMtLELWbx+YKuGk8Opf3n5r4D8P+pMW5FonS+BFQY4yA1HUqQH7tBygKESDR+8Vd/6NvvvgwIH554SqTi3P/7zf9Z8Gl4iWDm/A5ziUohM4S8jMX98TPEqABAUgCKpAHykAd6ABDYAasgC1wBG7AG/iDEBAJVgMWSASpgA+yQB7YBApBMdgJ9oBqUAcaQTNoBcdBJzgFzoNL4Bq4AW6D+2AUTIBnYBa8BgsQBGEhMkSB5CEVSBPSh8wgBmQPuUG+UBAUCcVCCRAPEkJ50GaoGCqDqqF6qBn6HjoJnYeuQIPQXWgMmoZ+h97BCEyCqbASrAUbwwzYCfaBQ+BVcAK8Bs6FC+AdcCXcAB+FO+Dz8DX4NjwKP4PnEIAQERqiihgiDMQF8UeikHiEj6xHipAKpAFpRbqRPuQmMorMIG9RGBQFRUcZomxRnqhQFAu1BrUeVYKqRh1GdaB6UTdRY6hZ1Ec0Ga2I1kfboL3QEegEdBa6EF2BbkK3oy+ib6Mn0K8xGAwNo42xwnhiIjFJmLWYEsw+TBvmHGYQM46Zw2Kx8lh9rB3WH8vECrCF2CrsUexZ7BB2AvsGR8Sp4Mxw7rgoHA+Xj6vAHcGdwQ3hJnELeCm8Jt4G749n43PwpfhGfDf+On4Cv0CQJmgT7AghhCTCJkIloZVwkfCA8JJIJKoRrYmBRC5xI7GSeIx4mThGfEuSIemRXEjRJCFpB+kQ6RzpLuklmUzWIjuSo8gC8g5yM/kC+RH5jQRFwkjCS4ItsUGiRqJDYkjiuSReUlPSSXK1ZK5kheQJyeuSM1J4KS0pFymm1HqpGqmTUiNSc9IUaVNpf+lU6RLpI9JXpKdksDJaMm4ybJkCmYMyF2TGKQhFneJCYVE2UxopFykTVAxVm+pFTaIWU7+jDlBnZWVkl8mGyWbL1sielh2lITQtmhcthVZKO04bpr1borTEaQlnyfYlrUuGlszLLZVzlOPIFcm1yd2WeydPl3eTT5bfJd8p/1ABpaCnEKiQpbBf4aLCzFLqUtulrKVFS48vvacIK+opBimuVTyo2K84p6Ss5KGUrlSldEFpRpmm7KicpFyufEZ5WoWiYq/CVSlXOavylC5Ld6Kn0CvpvfRZVUVVT1Whar3qgOqCmrZaqFq+WpvaQ3WCOkM9Xr1cvUd9VkNFw08jT6NF454mXpOhmai5V7NPc15LWytca6tWp9aUtpy2l3audov2Ax2yjoPOGp0GnVu6GF2GbrLuPt0berCehV6iXo3edX1Y31Kfq79Pf9AAbWBtwDNoMBgxJBk6GWYathiOGdGMfI3yjTqNnhtrGEcZ7zLuM/5oYmGSYtJoct9UxtTbNN+02/R3Mz0zllmN2S1zsrm7+QbzLvMXy/SXcZbtX3bHgmLhZ7HVosfig6WVJd+y1XLaSsMq1qrWaoRBZQQwShiXrdHWztYbrE9Zv7WxtBHYHLf5zdbQNtn2iO3Ucu3lnOWNy8ft1OyYdvV2o/Z0+1j7A/ajDqoOTIcGh8eO6o5sxybHSSddpySno07PnU2c+c7tzvMuNi7rXM65Iq4erkWuA24ybqFu1W6P3NXcE9xb3Gc9LDzWepzzRHv6eO7yHPFS8mJ5NXvNelt5r/Pu9SH5BPtU+zz21fPl+3b7wX7efrv9HqzQXMFb0ekP/L38d/s/DNAOWBPwYyAmMCCwJvBJkGlQXlBfMCU4JvhI8OsQ55DSkPuhOqHC0J4wybDosOaw+XDX8LLw0QjjiHUR1yIVIrmRXVHYqLCopqi5lW4r96yciLaILoweXqW9KnvVldUKq1NWn46RjGHGnIhFx4bHHol9z/RnNjDn4rziauNmWS6svaxnbEd2OXuaY8cp40zG28WXxU8l2CXsTphOdEisSJzhunCruS+SPJPqkuaT/ZMPJX9KCU9pS8Wlxqae5Mnwknm9acpp2WmD6frphemja2zW7Fkzy/fhN2VAGasyugRU0c9Uv1BHuEU4lmmfWZP5Jiss60S2dDYvuz9HL2d7zmSue+63a1FrWWt78lTzNuWNrXNaV78eWh+3vmeD+oaCDRMbPTYe3kTYlLzpp3yT/LL8V5vDN3cXKBVsLBjf4rGlpVCikF84stV2a9021DbutoHt5turtn8sYhddLTYprih+X8IqufqN6TeV33zaEb9joNSydP9OzE7ezuFdDrsOl0mX5ZaN7/bb3VFOLy8qf7UnZs+VimUVdXsJe4V7Ryt9K7uqNKp2Vr2vTqy+XeNc01arWLu9dn4fe9/Qfsf9rXVKdcV17w5wD9yp96jvaNBqqDiIOZh58EljWGPft4xvm5sUmoqbPhziHRo9HHS4t9mqufmI4pHSFrhF2DJ9NProje9cv+tqNWytb6O1FR8Dx4THnn4f+/3wcZ/jPScYJ1p/0Pyhtp3SXtQBdeR0zHYmdo52RXYNnvQ+2dNt293+o9GPh06pnqo5LXu69AzhTMGZT2dzz86dSz83cz7h/HhPTM/9CxEXbvUG9g5c9Ll4+ZL7pQt9Tn1nL9tdPnXF5srJq4yrndcsr3X0W/S3/2TxU/uA5UDHdavrXTesb3QPLh88M+QwdP6m681Lt7xuXbu94vbgcOjwnZHokdE77DtTd1PuvriXeW/h/sYH6AdFD6UeVjxSfNTws+7PbaOWo6fHXMf6Hwc/vj/OGn/2S8Yv7ycKnpCfVEyqTDZPmU2dmnafvvF05dOJZ+nPFmYKf5X+tfa5zvMffnP8rX82YnbiBf/Fp99LXsq/PPRq2aueuYC5R69TXy/MF72Rf3P4LeNt37vwd5MLWe+x7ys/6H7o/ujz8cGn1E+f/gUDmPP8usTo0wAAAAlwSFlzAAALEwAACxMBAJqcGAAAE1JJREFUeF7t3Qlb27gahmGRBUJIQoCwFhhoZ87//0HtbC3tUNrShZ0kHL/CokDZQmLH9vfcNFdL6DlXJ/70WpJleeLN6zcXDoBJpfh3AAYRAIBhBABgGAEAGEYAAIYRAIBhBABgGAEAGEYAAIYRAIBhBABgGAEAGEYAAIYRAIBhBABgGAEAGEYAAIYRAIBhBABgGAEAGEYAAIYRAIBhBABgGAEAGEYAAIYRAIBhBABgGAEAGEYAAIYRAIBhBABgGAEAGEYAAIYRAAZcXFw864XiIwAK4nbj7ff7rtfruV635/8cTExMuHK5fOerUqncaPj+fx+99L+//f9//e8hvybevH7Dkcyx2w1SjVWNuVarufZc2zdgfV+tVv3fqVQrrlKu+L97l+PjYx8Scnp66v98fn7uDg8O3fFR9LPSxNXP9Xt4IZ8IgJy53uDV2KdqU64+XXfT09Nuuj7tz+JJOzw6dGcnZ+7w8NCHhEKmVCrdCAbkAwGQA9cbvRq4zuZq8AudhfhvjNfZ2Zn7/OmzD4Nurxt1Q6LCinoKQhhkGwGQUWrs0u/1XalccvV6dJaPzvDNZtN36bNIPRK9Pn/+7E6OT3wwiHoHQhhkDwGQMb7hR7/6F5cNf3Fx0Y/nJycn47+RHxoiHB0euf39/ashAiGQLQRARqjh6+ypBqLG3p5vu1azFf803/Tftre358NAvQLCIDsIgDFT4wjd/dn2rOt0OlcNQ+8XrZGcnJy4vY97/mqDhjKEwHgRAGMSGr1m0H3DX+i4ciWbY/skKAB2P+y68+75ZY8g+tIvpIuFQGOgxq/uvgp/bW3NLS8vm2r8oqsY65vrfq1Ct9v1cx6a+0C66AGkKHT39VpZWXHNVjP+iW0Kw92Pu+771+9+kVK4hIjkEQAp8V3+6Fej2fDX78OyW8bAPx0cHLj9L/t+niBMFCJZDAESpkauM5wa/9LKklteWb5arUeB39RoNNzG5oZf86DPzIcmEkUAJCg0/qmpKbf9ctsv4sHD9Jm9WH/h50WiwdJleCIxBEBCVMjd866bX5h36xvrflEPHhd6Ra3ZltvY2PA3L+lKCZJBVSYgnPm3Xm65hYUFuvrPpJ7T1taWDwNdKeAqwegRACOmhq+XurEqYDxfmAPQcECTp+e986v3MBoEwAip4etOPZ21NJGF4VzvOa2urvqXhgOEwOgQACOgglRhanb/t63fXHWyGv8Eo6IwaLVa/iqB7icgBEaDABiSClFn/la75ba2t+J3kRStIPzjf3/4QLjoEwLDIgCGpMav8eny0nL8DpKmnpaurOjeAXoCwyEAhuDH/FF3X8t6kS7dMq1FVcwJDIcAeCYVnc5EmvDjMt94+JWDGxuXlwjxLATAM6jxa++7lVXO/OPmt0lrNX0I0BMYHAEwoFBkm5ubfqsujJ9uqW7ONv2xIQQGQwAMQMWlcX9nqeNno5Edqyurfl6AABgMATAANX4t8JltzcbvIEu0+lIbixACT0cAPJEa/+TUpC8yZJP2GNTQTDdhEQJPQwA8Qej6a8YZ2aZ5mc5ixx8vQuBxBMAjQuNffbHqd6lB9mnHpdp0jQB4Air6MVENqWvZbLCZR55oe3UFACHwMALgAb6Aoi+NK5EvukrTbrd97w33IwAeoOKZn5/3u9IgfzQXEB6LjrsRAPdQ0ajrPzvHJb+80hJtHT96AfcjAO6gxq+n8mp1Wblk64EdRTPXnuOuwQcQAHdQscw0ZtxiZzF+B3n2+++/+7UB+BUBcAfdYqpLSSgGv5vQbIuhwB0IgFtUJFruy4aexaLt2YWhwE0EwDWhOBaX6PoXjQJdwU4A3EQA3KLuoi4doXh8ALCP4A0EwDXq/utx1br8h+LRPIC2cKMX8BMBEFNRaIsvrR5DMeleDgU8k4E/EQAxBYBu9+XsX2yzs7N+jQePGbtEAMR0VtCyXxSb5ngarYbfOAQEgOfP/pOTbPNlhIZ5TAZeIgAiCgCt/IMNMzPRsWZ5sEcARHQ2qM/wME9LtHMQAUAAeNrjf6ZOD8ASTQYSAAQAk39GqcenKz7WQ8B0AOjg68X43x6t+ShXuORrvgegxSHs+GMT8wAEgJsoTbjaFI/4ssgvCjK+KtD8EEA3iMAmzQFoKGC5F2A+AJpNtvu2Snd96jZhAsAodf942IdtzAEYpQPvZ4K5+cc06zs/mT79EQCYrk8zBLBIB11jQALANi0IsnxjkPk5ANimE4G+rDIdAFoIAttKEyXTjw8zPQRgKSh0W7DlK0EMAWBbdOJnEtAgHXQWAUFbhFm+EmC6B6DLgIDlK0GmAwCwjgAADCMAAMMIAMAwAgAwzHQAnJ+fx3+CZb1uL/6TPWYDQNd/Dw4O4u9gla7/Hx8f+3qwyHQPgM1AoKXAVhu/mO4BdM+78XewSj0Ay0vCTZ8CT09P4z/BKgWA5oIYAhjEEAC6HXhC4wCjTA8BlPy9nt0ZYDg/EaxnQ1hl+hTY7Xb9g0Fh18nRCZOAFvlJwCgA+j32BLDs7Ows/pNN5ucAen2GALDLdACoF/Djx4/4O1ijOaDTs1OGAFbpwB8fHcffwRpNAGsYSAAYpj3hT05O4u9gydevX81fCjYfAFoFxopAmxT8ls/+Yn4IoBfzAPZo/N/vcgXIfA9AXUB1BWGL5n50BYgeAPzuwIeHh/F3sODrt2j8P0H58wlEdBYgAGw5PTmNDnz8jWEEQIQAsCVsBGO9+y8EQESFcH527o6OjuJ3UGTfvn2j8ccIgJgmA/e/7MffobAunPvx/Qe3gsf4FGI6I2iDEMsbRFqw/3Xf9KPAbiMAYgoALQ1VgaCYtOjr6z6r/67jk7hGhfHt6zf2CCgof2yNr/2/jQC4RXvEdc+6Zh8XXWSWt/++DwFwTSiO3d1dCqVgNL+jqzwc15sIgFs0DNBNIuwYXCyf9j753wmAmwiAO2iWOBQM8k+Tf1r8w+Tfr/hE7qBC0crAvb29+B3k2evXr/39HvgVAXAP9QK+f/vOtuE59+XLF7/vP13/uxEA91DBqOu4v8+6gDzSVRy9dOmPrv/9+GQeoMLRwpGzU9tbR+eRAnzv4x7X/R9BADxAhaOvdzvv4neQF7rkx9n/cXw6j4lOHro/QPMByAd1/T99+uQf+cXZ/2EEwCNUQDqL/PfffywRzgldwtWGHzT+xxEAT6BCKpfK7t3bn0MBlgpnk5b7auZfoU0API4AeCJ1J7VpyM7bnfgdZI0u2b79962/5k/jfxoCYAA6qxwdH/ldhCmw7FEPjTP/YAiAAaiwVGCfP31mD8GMef/+vd/rn8Y/GAJgQKHA3r17xx6CYxbmYXbe77jDg0N/bAiAwRAAz6Aiq5Qr7uPux/gdpE2NX8dBPbGD7wd+6TaNf3AEwDOp2LTK7K8//+KKwBjo89fmnpqU5Uaf5yMAhqD5AIXAh/cf4neQFu3X8PHjR1eucOYfBgEwJIWAuqFaKIR0nJ2duZ13l5djafzDIQCGpAJUCKg7quEAkqWJ1z9f/3k1B4DhEAAjoELUJJQWoigE2E4sGVp/oYU+1ckqjX9ECIARUk9Aewj88/c/V8+fw2js7Oz4qy6s8hstAmDEQm9AE4Nal47hffjwwR0dHvlLrzT+0SIAEqAiVW/g33/+9fsKcplwMOHz0u7MGlId/Li8zq9bszFaBEBCFALqrmpHobdv3/LMwScKk3sa72ttv+ZVfONHIgiABIWegLYU+/uvv/1jqfEwfWYKTG3nFT4/JIdPN2FXRRx1X1XUmhvQTSvC0OAmXUrVBOrp8an/zPTZIVkTb16/oQpTogYfXksrS262NRv/xLb+Rd/tftj1AcDKvnQRAGOgANDlQhX60vKSazabJotePaEvn7/4rdfD5T0af7oYAoyJurgKgfc77/0WVtboHgrNi2iyr1q9XNhD408fPYCUhPF++F0WOguuXq+7yclJ/72lBqDw05p+rZXQBitB+AwIg3QQACkIXX69Go2Gm1+Yd5NTk36jUTjX6/f8lRINB8JDPJkETAcBkCDf8Ht9V66WXafTcbVa7epsj7upV6AFQNrXv3fec6UyQZAkAmDEQhdfC1impqZce67tZmeZ7X8OrZvQQirdXBUWAxEGo0UAjEho+Orma0Zb3Xwa/mgoCDQ80MShX1MRIQhGgwAYgTDG13MEF5cXafgJURDs7e65i+iLOYLRIACGEMb4pUrJj/Fp+OlQEGiOoN+NPnvmCIZCADyDGr5eKrzFxUXXmm1dvU8xJuv6Z6wHtoa7LfUen/3gCIABqNDC77XpmltZWWFH2jHTvID2Yzw5PrkKAILg6QiAJ1Kj1zhfs9Ev1l/4Gf7wPgU3Htc/e10p0EahuvrC/MDTEQCPUJGFQpubn3Pz8/PxT5BFWla9/2X/6pgRBA/jXoAHhMY/VZty6xvrNP4c0DHSsdIxC8cP9yMA7qHCUZdfM/sbGxtXXX5kn46VjpmOnY4hIXA/AuAWFYvGkbrWvLG54RaXFuOfIG907HQMdSz9MSUIfkEAXBPO+q1Wy21vb/u1+8g3HUMdSx1TegO/IgBiKozuedctLC645ZVlNqIsEB1LHVMdWx1jQuAn8wEQzvqaLd56ueXm55joKyodWx1jHWt6A5dMB0Bo/FpO+vLVSyb6DNAx1rHWMScEDAeADrwmhjQ23Nreit+FFTrmOvbWJwdNBoAOuF5ax6+xYWmCqRBrdMx17FUDoR4sMlf5OtDq+q2urfqVfVYPPC5rQTWgWrA6HDAVADrA6vJpK+6ZmRn/HktF7QrHXrWgmrA4HDATADqw591zt7y6zH37+IVqQrWhGrEUAiYCwM/0l0puc3OTp/HgXqoN1YhqRTVjQeEDQAdSXb3tl9t+D37gIaoR1UpYK1B0hQ6AcObffrUdvwM8jWrGQk+gsAGgcZwOoFZ+cZkPg1LN+NqJaqjIcwKFbBk6YN1e198NRuPHc6l2VEOqpaKGQOFaR2j8a2tr/qm7wDBUQ6qlooZAoQJAB0iv1dVVGj9GRrWkmgr1VSSFCQAdGE3YaHmn1ngDo6SaUm2pxooUAoUJAG0PrSWdnPmRFN8TiGpMtVYUhQgALeHUSi49ehtIkmpMtaaaK4JcB0Do9uuR2+zdh7So1lRzRRgO5D4AKtWK2/xtky28kBrVmmpOtUcAjIk+eD2Nd/3FOnf0IXWqOV970VeeQyCXAaAPXK/5zrxPYWAcVHuqwVCPeZS7ANAHrbGXZmTn5ubid4HxUA2qFvM6H5CrAAgfsLpfuiab19RFcagGVYthGJq3msxdD6DX7blXv7/yf2bsj3ELNaiaVG3mTW4CQMna6/fc2voaDR+Zo5pce7HmazRPvYDcBIDGWHPtORb7ILMazYavUdVqXuQiAJSoStj5BZ7ag2xTjapW89ILyHwA6IPU2ms95ZXFPsg61ahqVTWbhxDIdADoA9Sr2Wry2C7khmpVNRvqN8ty0QPQhgxAnqhms974JbMB4NMz+lpZWYnfAfJFteurOMNBkOkAmKpddqWAPPJD16iGCYAB6QPTpZTlpeX4HSCfVMNZXiacyQDQB6ZntemeayDPVMOq5ayuDchcACgpS+WSa7fb8TtAvqmWVdNZ7AVkLgCUlJ1OJ/4OKAbVdBZ7AZkKgJCQPL0XRRNqOmu9gMwEgP9gol9aRQUUka9tlXmGQiBTAVBv1F2tVovfAYpFta0aJwBuCR8IY38UXajxrIRAZgJA2ypVq9X4HaCYVOOqdQIgpg+if9F3nUXO/rBBta6az0IIZCIA9Nw1bvWFFap11TwBENF901opBViims/CMwbHGgBaGNGea7vSRCamIoDUqOZV++NeHDS2lhe6PwsLC/53wJpQ++McCow1AOozdWb+YZZqX23AZgD0owCYrsffATapDagtjMtYAkCJV52sutk2a/5hm9qA2sK4egFjCYB+r+/m5ud4wAfMUxtQW1CbGIfUA0BJp6eqcscfcEltQW1iHL2AsQQAO/0AN6lNmAiAXq/nllZY+ANcpzahtpG2VANACadbIqsVLv0B16lNqG2k3QtILQD0H6aXHqAI4FdqG6GdpCXVHgAP+ATuFx4smqZUewDq5kxEXwB+pbahNlK4HkD4D2LyD3hYaCNphUBqPYBSqeQqlUr8HYC7qI2oraQltR5Ao9UgAIBHqI2orRSqB6B7nrnxB3gatZW09glIPACUZLrZodHg8h/wFGorad0glEoA1Ouc/YFBqM0UJgBmZmbi7wA8hdpMIQJAGx/S/QcGozaTxqahiQZA2PQTwODS2DQ0sQBQ98V3/+t0/4HnUNsJ7SgpifYAtK5Zs5kABqe2k/S9AcnOAUT/9unp6fgbAIPwbSfhW2cSHQLQ/QeGE4YBSUk0ALj3HxhO2CMgKYkEgP7BuqFhamoqfgfAc6gNqS0lFQKJ9QDKpbLf6RTA86kNqS0lJbEewNR0lFw89BMYitqQ2lKuegD6x07XmP0HRkFtKVcBoNVLTAACo6G2lNSKwJEHgJJK45a0NzcEikptKaknB42+BxD9G/WUkzS3NQKKTG3JP00rgVHA6HsA0Zff/ZceADASfkm9dgtOIAESGQLUpmvxdwBGQW0qF0MA/SPZAAQYrWQ2CHHu/zv1zev/5eqVAAAAAElFTkSuQmCC',
      phone: form.phone || '',
      insertDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
