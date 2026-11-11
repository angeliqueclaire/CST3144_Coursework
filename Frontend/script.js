let webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'Activities',
        showProduct: true,
        totalCart: 0,
        cart: [],
        sortOrder: 'asc',
        sortOpt: 'price',
        activity: [],
        user: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
        },
        order: {
            country: '',
            address: '',
            city: '',
            postalCode: '',
        },
        cityOptions: [
            { value: 'DU', text: 'Dubai' },
            { value: 'AD', text: 'Abu Dhabi' },
            { value: 'SHJ', text: 'Sharjah' },
            { value: 'AJM', text: 'Ajman' },
            { value: 'FUJ', text: 'Fujairah' },
            { value: 'RAK', text: 'Ras Al Khaimah' },
            { value: 'UAQ', text: 'Umm Al Quwain' }
        ]
    },

    created: function() {
        fetch('http://localhost:3000/api/activities').then (
            function(response) {
                response.json().then(
                    function(json) {
                        webstore.activity = json;
                    }
                )
            }
        )
    },

    methods: {
        addToCart: function(activity) {
            this.cart.push(activity);
            activity.availableInventory--
            activity.quantity++;
        },
        removeFromCart: function(item) {
            for (let i = 0; i < this.activity.length; i++) {
                if (this.activity[i].id === item.id) {
                    this.activity[i].availableInventory++;
                    this.activity[i].quantity--;
                    break;
                }
            }
            for (let j = 0; j < this.cart.length; j++) {
                if (this.cart[j].id === item.id) {
                    this.cart.splice(j,1);
                    break;
                }
            }
            if(this.cart.length == 0) {
                this.showProduct = true;
            }
        },  
        showCheckout: function() {
            this.showProduct = this.showProduct ? false:true;
            if (this.cart.length == 0) {
                this.showProduct = !this.showProduct;
            }
        },  
        validateForm: function() {
            if (!this.order.country || !this.order.address || !this.order.city || !this.order.postalCode) {
                alert("Please fill in all required fields.");
                return false;
            }
            if (this.order.postalCode.length !== 5) {
                alert("Please enter a valid postal code.");
                return false;
            }
            else {
                return true;
            }
        },
        submitForm: function() {
            if (this.validateForm()) {
                var activityIDs = 
                alert("Form submitted successfully!");
                this.showProduct = true;
            }
        },
        
        sort: function() {
        function compare(a, b) {
            let order = webstore.sortOrder;
            let option = webstore.sortOpt;

            if (option == 'price') {
                if (order == 'asc') {
                    if (a.price < b.price) return -1;
                    if (a.price > b.price) return 1;
                    return 0;
                }
                else if (order == 'desc') {
                    if (a.price < b.price) return 1;
                    if (a.price > b.price) return -1;
                    return 0;
                }
            }

            else if (option == 'class') {
                if (order == 'asc') {
                    if (a.class < b.class) return -1;
                    if (a.class > b.class) return 1;
                    return 0;
                }
                else if (order == 'desc') {
                    if (a.class < b.class) return 1;
                    if (a.class > b.class) return -1;
                    return 0;
                }
            }

            else if (option == 'location') {
                if (order == 'asc') {
                    if (a.location < b.location) return -1;
                    if (a.location > b.location) return 1;
                    return 0;
                }
                else if (order == 'desc') {
                    if (a.location < b.location) return 1;
                    if (a.location > b.location) return -1;
                    return 0;
                }
            }
            return 0;
        }

        this.activity.sort(compare);
    }


    },
    computed: {
        errors: function() {
            return this.user.phone.length == 10 &&
            /^\d+$/.test(this.user.phone) &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email) &&
            /^[A-Za-z]+$/.test(this.user.firstName) &&
            /^[A-Za-z]+$/.test(this.user.lastName); 
        },
        cartItemCount: function() {
            return this.cart.length ||"";
        },
        sumOfCart: function() {
        return this.cart.reduce(function(total, item) {
            return total + item.price;
            }, 0);   
        },
        cartSlots: function() {
            return Object.values(
                this.cart.reduce(function(slots, item) {
                    if(slots[item.id]) {
                        slots[item.id].quantity++;
                    } else {
                        slots[item.id] = {
                            id: item.id,
                            image: item.image,
                            rating: item.rating,
                            class: item.class,
                            location: item.location,
                            price: item.price,
                            quantity: 1
                        };
                    }
                    return slots;
                }, {})
            )
        },
    }
    
});