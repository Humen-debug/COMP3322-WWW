# COMP3322 Assignment2 Online Shopping

Author: Chau Hiu Man, Humen (3035783716)

This is a README to describe the coding, which is not given in Assignment2, in App.js.
There is no more explanation about product.js because it mostly follows the instructions provided in Assignment2.

Due to the nature of cors(), requests other than GET and POST are unavailable.

## MainPage

-   Acts as a page switcher, rendering ShopPage, SignInPage, CartPage, and ProductPage by using renderSwitch() method and isSignInHidden boolean.

-   Acts as the main data base on the webpage, in which its state includes:

    1. page: a _String_ to acts as page indicator
    2. productInfo: an _Array_ to store the products retrieved from the server
    3. product: an _Object_ which stores detailed information of the selected product in ShopPage
    4. categories: a _Set_ which contains the categories of products
    5. currentFilter: a _String_ that contains the selected category (i.e. the value of select/option in the dropdown)
    6. searchString: a _String_ that contains the input of the search string in the Header
    7. userInfo: an _Object_ that contains the user's name(i.e. username), and the total number of products in the user's cart(i.e. totalnum)
    8. isSignInHidden: a _Boolean_ that contains should SignInPage be hidden; true if the signIn button is clicked

-   Functions included in MainPage:

    1. toggleSignIn(): to toggle isSignInHidden
    2. renderSwitch(param):
       @param: param: a _String_ which is this.state.page
       @description: to switch the React Component according to the param.
    3. findProduct(id, manufacturer, description):
       @param:

        - id: a _String_ that is the productId being clicked in ShopPage
        - manufacturer: a _String_ that is retrieved from showProduct(id) in ShopPage
        - description: a _String_ that is retrieved from showProduct(id) in ShopPage

        @description: To find the product in productId by id. if product is in productId, stores manufacturer and description to the product

    4. handlePageChange: to update page according to the user's input
    5. handleCategoryChange: to update currentFilter in select on Header
    6. handleSearchChange: to update searchString in input[type=text] on Header

## Header

-   Top Bar of the website, includes the search box, category filter, cart, and sign in.
-   Contains _Boolean_ loggedIn to determine if the user logged in. If the user does not log in (i.e. loggedIn = false), then the Header should shows the "Sign in" button; otherwise, the Header should show the "Cart" div and the "Sign out" div

## Footer

-   Directs to the ShopPage by handlePageChange()
-   Message displayed is according to the props.param (which could be "Go Back" from ProductPage or "Continue Browsing" from ProductPage or CartPage)

## SignInPage

-   Functions included in SignInPage:

    1. handleInputChange(event): to handle changes of input fields, including Username and Password.
    2. isInputFilled(): to check if all inputs are filled by using jQuery. If yes, return true; otherwise, return false.

## ShopPage

-   Renders each product div, which directs to ProductPage after clicked, in productInfo given in MainPage.

## ProductPage

-   State includes
    1. quantity: an _Int_ to update product.quantity in addToCart().
    2. bought: a _Boolean_ to determine if the "addToCart" button is clicked. After "addToCart" button is clicked (i.e. bought = true), the "product_container" div will be changed to a "popUpMessage" div.

## CartPage

-   State includes:

    1. cart: an _Array_ to store cart retrieved from the back-end in method showProductsInCart().
    2. totalPrice: an _Int_ to display the total price of all products in the user's cart on the bottom "cartBar" div and on the "popUpMessage" div after check out.
    3. totalnum: an _Int_ to display the total number of products in cart on the bottom "cartBar" div and on the "popUpMessage" div after check out.
    4. checkOut: a _Boolean_ to determine if "Check Out" button is clicked.

-   Function included in CartPage:

    1. handleTotalPriceChange(event, price):
       @param:

        - event: used to find its target.defaultValue and target.value corresponding to their attribute in the input tag.
        - price: the corresponding product's price that is being updated.

        @description: Add the totalPrice by price if the target.value is larger than target.defaultValue; otherwise, subtract price from totalPrice. Update target.defaultValue to target.value after calculation of totalPrice.
