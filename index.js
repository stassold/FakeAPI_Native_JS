// Значения по умолчанию, в случае поломки Endpoint
const intialStateObj = {
    "id": 1,
    "title": "iPhone 9",
    "description": "An apple mobile which is nothing like apple",
    "price": 549,
    "discountPercentage": 12.96,
    "rating": 4.69,
    "stock": 94,
    "brand": "Apple",
    "category": "smartphones",
    "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    "images": [
        "https://i.dummyjson.com/data/products/1/1.jpg",
        "https://i.dummyjson.com/data/products/1/2.jpg",
        "https://i.dummyjson.com/data/products/1/3.jpg",
        "https://i.dummyjson.com/data/products/1/4.jpg",
        "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
    ]
}

// Модальное окно с параметрами
const modal = document.getElementById('modal')
const modal_description = document.getElementById('modal_description')
const modal_price = document.getElementById('modal_price')
const modal_brand = document.getElementById('modal_brand')
const modal_image = document.getElementById('modal_image')

//Url - ссылка на API
const url = "https://dummyjson.com/products?limit=50"
// div - где отображаются продукты
const products_div = document.getElementById('products')
// input отоюражения элементов на странице 
const limit_input = document.getElementById('limit')
// root - главный div где идет отрисовка
const root = document.getElementById('root')

// ipnut и button отвечающие за сортировку 
const sort_name_input = document.getElementById('sort_name')
const sort_name_price = document.getElementById('sort_price')
const cancel_sort_button = document.getElementById('cancel_sort')

//Сброс сортировки
let Cancel_sort = () => {
    sort_name_input.checked = false
    sort_name_price.checked = false
}

// лимит отображения элементов на станице
let limit
// id текущего элемента, на который навели курсор 
let current_id_prod
// id текущего элемента, который выбрали для перемещения 
let current_id_prod_moved
// массив всех элемнтов с продуктами
let products = []
// массив элементов который отображаются на странице
let current_products = []
// состояния перемещения 
let moved = false

//Функция заполнения модального окна информацией по id продукта
let Filling_modal_windows = (id) => {
    let modal_obj = current_products.filter(obj => obj.id == id)
    let obj_prod = modal_obj[0]
    modal_description.textContent = obj_prod.description
    modal_price.textContent = obj_prod.price + "$"
    modal_brand.textContent = "Brand: " + obj_prod.brand
    modal_image.src = obj_prod.images[0]
}

//Функция вызова модального окна по координатам относительного объекта 
let Call_modal_windows = (x, y) => {
    modal.style.background = "azure"
    modal.style.width = "500px"
    modal.style.height = "500px"
    modal.style.position = "absolute"
    modal.style.display = "block"
    modal.style.left = `${x}px`
    modal.style.top = `${y}px`
}

//Функция вызова закрытие модального окна
let Close_modal_windows = () => {
    modal.style.display = "none"
}

// Функция создания продуктами с добавление ид, тайтла и событий для каждого
let Create_div_products = (step) => {
    let div = document.createElement('div');
    let textNode = document.createTextNode(current_products[step].title);
    div.id = current_products[step].id
    div.className = "item_product"
    div.appendChild(textNode)
    div.dataset.moved = 'false';
    // событие наведени курсора на элемент
    div.addEventListener('mouseover', (event) => {
        if (div.dataset.moved == "false")
            div.style.background = "green"
        current_id_prod = event.target.id
        Filling_modal_windows(event.target.id)
        //получаем padding элемента root , чтобы получить отспут слева
        let padding_root = Number(getComputedStyle(root).padding.replace('px', ''))
        //получаем значение ширины для тайтла одного продукта
        let widht_div = event.target.clientWidth
        // Получаем значение нижней границы выбранного элемента с продуктом
        let bottom_div = event.target.getBoundingClientRect().top
        Call_modal_windows(widht_div + padding_root + 5, bottom_div)
    })
    // событие убирания курсора с элемента
    div.addEventListener('mouseout', () => {
        Close_modal_windows()
        if (div.dataset.moved == "false")
            div.style.background = "rgb(52, 52, 150)"
    })
    // cобытие нажатия левой кнопки мыши для активирования состояния перемещения элемента
    div.addEventListener('mousedown', (event) => {
        // если глобальная переменная moved активна, то есть сейчас событие переноса активно, то при нажатии на элемент произойдет замена элементов (swap)
        if (moved) {
            Swap_products(current_id_prod_moved, current_id_prod)
        }
        else {
            current_id_prod_moved = event.target.id
            div.style.background = "red"
            root.style.cursor = "move"
            div.style.cursor = "move"
            event.target.dataset.moved = 'true'
            moved = true;
        }
    })
    products_div.appendChild(div)
}

//Перерисовка элементов 
let Render = () => {
    //Удаляем старые элементы
    while (products_div.firstChild) {
        products_div.removeChild(products_div.firstChild);
    }
}


// Функция найти индекс по id элемента
let Get_id_prod = (id) => {
   return current_products.findIndex(obj => obj.id == id)
}

// меняем элементы в списке
let Swap_products = (id, current_id) => {
    let one_index_prod = Get_id_prod(id)
    let two_index_prod = Get_id_prod(current_id)
    //[products[one_index_prod], products[two_index_prod]] = [products[two_index_prod], products[one_index_prod]]
    let obj = products[one_index_prod]
    products[one_index_prod] = products[two_index_prod]
    products[two_index_prod] = obj
    moved = false
    Render()
    Cancel_sort()
    AddRootDiv(limit_input.value)
}

let AddRootDiv = (count,sort = "false") => {
    current_products = products.slice(0, count)
    switch (sort) {
        case "name":
            Sort_name_func("title")
          break;
        case "price":
            Sort_name_func("price",-1)
          break;
        default:
            break;
      }
    let step
    for (step = 0; step < count; step++) {
        Create_div_products(step)
    }
}

// Получить списки продуктов с API
let GetProducts = async function () {
    let response = await fetch(url)
    if (response.ok) {
        json = await response.json()
        products = json.products
        limit = json.limit
        limit_input.max = limit
        if (limit < 10)
            limit_input.value = limit
        AddRootDiv(limit_input.value)
    } else {
        alert("Error HTTP: " + response.status)
        limit_input.max = 1
        limit_input.value = 1
        products[0] = intialStateObj
        AddRootDiv(limit_input.value)
    }
}
GetProducts()

// Функция изменения input с отображением кол-ва элементов
limit_input.oninput = () => {
    if (limit_input.value > limit) limit_input.value = limit
    if (limit_input.value < 1) limit_input.value = 1
    Cancel_sort()
    Render()
    AddRootDiv(limit_input.value)
    
}

// Сброс сортировки 
cancel_sort_button.onclick = () => {
    Cancel_sort()
    Render()
    AddRootDiv(limit_input.value)
}

// вызов сортировки по имени
sort_name_input.onclick = () => {
    Render()
    AddRootDiv(limit_input.value,"name")
}

sort_name_price.onclick = () => {
    Render()
    AddRootDiv(limit_input.value,"price")
}

// Сортировка отображаемого массива
let Sort_name_func = (name_field,condition = 1) => {
    current_products = current_products.sort( (a,b,c=condition,field=name_field) => {
        if (a[field] > b[field] ) {
            return c
          }
          if (a[field]  < b[field] ) {
            return -c
          }
          // a должно быть равным b
          return 0
    })
}