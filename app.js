// 載入express套件
const express = require('express')
const app = express()

// 導入scss編譯套件
const sassMiddleware = require('node-sass-middleware')
const path = require('path')

// 連接埠號
const port = 3000

// 載入 express-handlebars
const exhbs = require('express-handlebars')
// 載入json資料
const restaurantList = require('./restaurant.json')

// 設定樣板引擎
app.engine('handlebars', exhbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// scss編譯套件設定
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public'),
    // debug: true,
    // outputStyle: 'compressed',
  })
)

// 設定靜態檔案
app.use(express.static('public'))

// 處理請求和回應
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

// 處理搜尋頁面的請求和回應
app.get('/search', (req, res) => {
  // 篩選字串
  const keyword = req.query.keyword
  // 篩選餐廳名稱
  const restaurantName = restaurantList.results.filter(restaurant => {
    return (restaurant.name.toLowerCase().includes(keyword.toLowerCase()))
  })
  // 篩選餐廳類別
  const restaurantCategory = restaurantList.results.filter(restaurant => {
    return (restaurant.category.toLowerCase().includes(keyword.toLowerCase()))
  })

  // 合併（篩選名稱、篩選類別）不重複的餐廳
  const searchSet = new Set()
  // 新增至Set: 篩選的物件資料會放在陣列內，為了用Set合併要先forEach把物件資料取出，再新增至Set物件
  restaurantName.forEach(restaurant => { searchSet.add(restaurant) })
  restaurantCategory.forEach(restaurant => { searchSet.add(restaurant) })
  // Set物件轉陣列: 先展開元素再放到陣列
  const searchArr = [...searchSet]
  // 使用sort的自定義排序方法，將資料的id做排序，畫面上會照順序顯示資料
  searchArr.sort((a, b) => a.id - b.id)

  // 渲染局部樣板
  res.render('index', { restaurants: searchArr, keyword: keyword })
})

// 處理 show 個別資料頁面的請求和回應
app.get('/restaurants/:restaurant_id', (req, res) => {
  // 找出點擊的餐廳資料id
  const restaurantId = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  // 渲染 show 個別資料頁面
  res.render('show', { restaurant: restaurantId })
})

// 啟動並監聽伺服器
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})