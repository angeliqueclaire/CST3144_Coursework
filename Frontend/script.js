let webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'Activities',
        showProduct: true,
        totalCart: 0,
        cart: [],
        sortOrder: 'asc',
        sortOpt: 'price',
        activity: [
            {id: 1001, class: 'Football', rating: 5, location: 'Dubai, Al Wasl Sports Club', price: 110, image: 'images/football.png', availableInventory: 10, quantity: 0},
            {id: 1002, class: 'Basketball', rating: 3,location: 'Dubai, JSS Private School', price: 120, image: 'images/basketball.png', availableInventory: 10, quantity: 0},
            {id: 1003, class: 'Swimming', rating: 5, location: 'Abu Dhabi, Country Club', price: 130, image: 'images/swimming.png', availableInventory: 10, quantity: 0},
            {id: 1004, class: 'Tennis', rating: 3, location: 'Dubai, Al Naayat Street', price: 140, image: 'images/tennis.png', availableInventory: 10, quantity: 0},
            {id: 1005, class: 'Cricket', rating: 4, location: 'Abu Dhabi, Zayed  City', price: 150, image: 'images/cricket.png', availableInventory: 10, quantity: 0},
            {id: 1006, class: 'Dance', rating: 3, location: 'Sharjah, Wanderers Club', price: 160, image: 'images/dance.png', availableInventory: 10, quantity: 0},
            {id: 1007, class: 'Singing', rating: 2, location: 'Dubai, Al Wasl Sports Club', price: 170, image: 'images/singing.png', availableInventory: 10, quantity: 0},
            {id: 1008, class: 'Gymnastics', rating: 4, location: 'Sharjah, Baseline Academy', price: 180, image: 'images/gymnastics.png', availableInventory: 10, quantity: 0},
            {id: 1009, class: 'Ice Hockey', rating: 3, location: 'Abu Dhabi, Zayed City', price: 190, image: 'images/ice_hockey.png', availableInventory: 10, quantity: 0},
            {id: 1010, class: 'Karate', rating: 1, location: 'Sharjah, Wanderers Club', price: 200, image: 'images/karate.png', availableInventory: 10, quantity: 0}
        ],
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