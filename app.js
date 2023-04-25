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
// 載入JSON資料
const restaurantList = require('./restaurant.json')

// 設定樣板引擎
app.engine('handlebars', exhbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// scss編譯套件設定
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public'),
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
  // 關鍵字是falsy就回到根目錄
  if (!req.query.keyword) {
    return res.redirect("/")
  }

  // 篩選字串
  const keyword = req.query.keyword.trim().toLowerCase()

  // 篩選餐廳名稱、類別
  const restaurantFiltered = restaurantList.results.filter(restaurant =>
    restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword)
  )

  // 當符合條件筆數為0，回到根目錄
  if (restaurantFiltered.length === 0) {
    return res.redirect("/")
  }

  // 渲染局部樣板
  res.render('index', { restaurants: restaurantFiltered, keyword: keyword })
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