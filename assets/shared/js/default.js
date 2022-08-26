/**
 * BARTENDER - Bartender Tool <br>
 * All JS functions used in the CSP site
 * @author  JDel
 */
let BARTENDER = {
    /**
     * All Functions Relating to Ordering
     */
    Order: {
        AddToCart: function (id) {
            // Record Changes Via Input
            let input = $('input[name="order"]');
            input.val(input.val() + id + ',');

            // Apply to Front-End
            $('#' + id).addClass('list-group-item-success').attr('onclick', 'BARTENDER.Order.RemoveFromCart(' + id + ')');
            BARTENDER.Order.checkSubmit();
        },

        RemoveFromCart: function (id) {
            // Record Change Via Input
            let input = $('input[name="order"]');
            let temp = input.val().replaceAll(id + ',', '');
            input.val(temp);

            // Apply to Front-End
            $('#' + id).removeClass('list-group-item-success').attr('onclick', 'BARTENDER.Order.AddToCart(' + id + ')');
            BARTENDER.Order.checkSubmit();
        },

        checkSubmit: function () {
            let val = $('input[name="order"]').val();
            if(val.length > 1) { $('#submitOrderBtn').removeClass('d-none'); }
            else { $('#submitOrderBtn').addClass('d-none'); }
        },

        SubmitCart: function () {
            Swal.fire({
                title: 'Add Product',
                html:
                    `<input type="text" id="name" class="swal2-input" placeholder="Name">`,
                confirmButtonText: 'Create Product',
                showCancelButton: true,
                focusConfirm: false,
                preConfirm: () => {
                    const name = Swal.getPopup().querySelector('#name').value
                    if (!name) { Swal.showValidationMessage(`Please Enter A Name For this Order`); }
                    return { name: name };
                }
            }).then((result) => {
                let data = {
                    name: result.value.name,
                    products: $('input[name="order"]').val()
                }

                let successAction = (data) => {
                    BARTENDER.Helpers.Swal.Reload.success('Order Submitted');
                };

                BARTENDER.Helpers.ajax('AddOrder', data, successAction, 'Order Creation');
            });
        },

        ViewProducts: function (customerName) {
            let successAction = (products) => {
                let readyTest = (ready) => (ready == '0');
                let readyClass = (ready) => (ready == '0') ? 'list-group-item-danger' : 'list-group-item-success';
                let readyText = (ready) => (ready == '0') ? 'Not Ready' : 'Ready';
                let html = `<ul class="list-group list-group-flush">`;
                products.forEach(product => {
                    html += `<li class="list-group-item list-group-item-action ${readyClass(product['ready'])}" id="${product['order_id']}OrderProduct" 
                                    onclick="BARTENDER.Order.UpdateProgress(${product['order_id']}, ${readyTest(product['ready'])})">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">${product['name']}</h5>
                                    <small id="${product['order_id']}OrderProductReadyText">${readyText(product['ready'])}</small>
                                </div>
                            </li>`;
                });
                Swal.fire({ title: `${customerName}'s Order`, text: 'Click to Change Order Progress', html: html }).then(BARTENDER.Helpers.reload);
            };

            BARTENDER.Helpers.ajax('GetOrderProducts', {name: customerName}, successAction, 'Load Order Products');
        },

        UpdateProgress: function (id, ready = false) {
            let successAction = (ready) ? () => {
                $(`#${id}OrderProduct`).removeClass('list-group-item-danger').addClass('list-group-item-success')
                    .attr('onclick', `BARTENDER.Order.UpdateProgress(${id}, ${!ready})`);
                $(`#${id}OrderProductReadyText`).html('Ready');
            } : () => {
                $(`#${id}OrderProduct`).removeClass('list-group-item-success').addClass('list-group-item-danger')
                    .attr('onclick', `BARTENDER.Order.UpdateProgress(${id}, ${!ready})`);
                $(`#${id}OrderProductReadyText`).html('Not Ready');
            }

            BARTENDER.Helpers.ajax('EditOrderProgress', {id: id, ready: (ready)?1:0}, successAction, 'Order Progress Modification');
        }
    },

    /**
     * All Functions Relating to Products
     */
    Products: {
        Add: function () {
            Swal.fire({
                title: 'Add Product',
                html:
                    `<input type="text" id="name" class="swal2-input" placeholder="Name">
                    <input type="text" id="description" class="swal2-input" placeholder="Description">
                    <input type="number" min="0" max="999999" step="0.01" id="price" class="swal2-input" placeholder="10.00">`,
                confirmButtonText: 'Create Product',
                focusConfirm: false,
                preConfirm: () => {
                    const name = Swal.getPopup().querySelector('#name').value
                    const description = Swal.getPopup().querySelector('#description').value
                    const price = Swal.getPopup().querySelector('#price').value
                    if (!name || !price) {
                        Swal.showValidationMessage(`Please enter A Name and Price`);
                    }
                    return { name: name, description: description, price: price };
                }
            }).then((result) => {
                let data = {
                    name: result.value.name,
                    description: result.value.description,
                    price: result.value.price,
                }

                let successAction = (data) => {
                    BARTENDER.Helpers.Swal.Reload.success('New Product Created!');
                };

                BARTENDER.Helpers.ajax('AddProduct', data, successAction, 'Product Creation');
            });
        },
    },


    /**
     * Audit Log Funcitons <br>
     * For everything on the Audit Dashboard
     */
    Audit: {
        init: function () {
            $("#AuditPageSelect").on('change', function() {
                window.location.href = `?page=${$(this).val()}`;
            });
        }
    },

    /**
     * Helpers <br>
     * These are functions intended to be called by other functions <br>
     * In affect these just help clean up other code
     */
    Helpers: {
        /**
         * Go To Path
         * @param path  {string}        Path to go to
         * @param data  {bool|Object}   Data to pass (for Get, ?key=value)
         * Acts like a href, for onclick
         */
        goToPath: function (path, data = false) {
            location.href = location.origin + (path ?? '/dashboard') + (data !== false ? BARTENDER.Helpers.convertToGetData(data) : '');
        },

        /**
         * Reload
         * Reloads the Current Page
         */
        reload: function () { window.location.reload(); },

        /**
         *  Ajax Helper Function <br>
         *  Runs ajax call based on parameters and handles the errors
         * @param func              {string}            The function for the URL of the ajax call
         * @param data              {object}            The data to pass to the ajax call
         * @param successAction     {function}          Action to be preformed on Success, Passes response["data"] if available
         * @param desc              {string}            String description of what is happening (for swal messages, Ex: `Template Creation`)
         * @param isPOST            {boolean}           True= POST | False= GET | Default= True
         * @param successAlert      {boolean}           Whether to show alert for a success
         * @param form              {boolean}           Whether this is for a form
         * @param validationAction  {boolean|function}  False for nothing, or function to be preformed when validation fails
         */
        ajax: function (func, data, successAction, desc, isPOST = true, successAlert = false, form = false, validationAction = false) {
            // Step 1: Initialize Data
            // Setup Url
            let url = `/Data/${func}`;
            if(!isPOST){
                url += BARTENDER.Helpers.convertToGetData(data);
            }

            // Step 2: Ajax Call    TODO: test processData change
            $.ajax({ url: url, data: data, type: (isPOST ? 'POST' : 'GET'), async: true,
                // Success action
                success: function (response) {
                    // Convert response to object
                    let resp = JSON.parse(response);

                    // If internal success
                    if(resp['Success']){
                        // Add debug data
                        BARTENDER.Debug.add(`${desc} Succeeded`, "Ajax", resp);

                        // Alert the user (if enabled)
                        if(successAlert) {  BARTENDER.Helpers.Swal.success(`${desc} succeeded`); }

                        // Run success action, passing in data if possible
                        if(resp.hasOwnProperty('data')){
                            successAction(resp['data']);
                        } else {
                            successAction();
                        }
                        // If Invalid Form Error
                    } else if(form && !resp['valid']){
                        // Add debug data
                        BARTENDER.Debug.add(`${desc} failed Validation`, "Ajax", resp);

                        // Run Validation action
                        if(validationAction !== false) {
                            validationAction(resp['errorsData']);
                        }
                        // Notify User
                        BARTENDER.Helpers.Swal.validation(`${desc}`);
                        // Other Internal Error
                    } else {
                        // Add debug data
                        BARTENDER.Debug.add(`${desc} failed`, "Ajax", resp);

                        // Notify User
                        BARTENDER.Helpers.Swal.warn("Error", `${desc} failed`);
                    }
                },
                error: function (response) {
                    BARTENDER.Debug.add(`${desc} failed`, "Ajax", response);

                    BARTENDER.Helpers.Swal.error(`${desc} failed at Server`);
                }
            });
        },

        /**
         * Convert to Get Data
         * @param data {Object} Data to convert
         * @return string   Data to ammend to url
         */
        convertToGetData(data) {
            let urlData = "?";
            // Cycle through all key value pairs of data and converting them into a GET query
            for(const [key, value] of Object.entries(data)){
                urlData += `${key}=${value}&`;
            }
            // Remove Last '&'
            urlData = urlData.slice(0, -1);
            return urlData;
        },

        /**
         * SWAL <br>
         *     These all create SWAL messages with similar global styles
         */
        Swal: {
            // Simple SWAL
            /**
             * Show Validation Errors Message
             * @param entity    {String}    Your {entity} Form has Validation errors
             */
            validation: function(entity = '') {
                let msg = document.createElement('div');
                msg.innerHTML = `<span class='text-center'>Your ${entity} Form has validation errors, please review all of the <span class='text-danger'>red text</span> ` +
                    `to resolve errors.</span>`;
                let temp = { icon: "warning", title: "Validation Error"};
                BARTENDER.Helpers.Swal.compile(temp, false, msg);
            },
            /**
             * Success Swal <br>
             * Title: Success <br>
             * Icon: Info
             * @param text  {String}    Text for Success Swal
             */
            success: function (text) {
                let temp = {icon: "info", title: "Success"};
                BARTENDER.Helpers.Swal.compile(temp, text);
            },
            /**
             * Info Icon Swal
             * @param title     {String}            Title for Swal
             * @param text      {String|Boolean}    Text for Swal or empty for no-text
             * @param content   {Object|Boolean}    Alternative Data for Swal Body
             */
            info: function (title, text = false, content = false) {
                let temp = {icon: "info", title: title};
                BARTENDER.Helpers.Swal.compile(temp, text, content);
            },
            /**
             * Warning Icon Swal
             * @param title     {String}            Title for Swal
             * @param text      {String|Boolean}    Text for Swal or empty for no-text
             * @param content   {Object|Boolean}    Alternative Data for Swal Body
             */
            warn: function (title, text = false, content = false) {
                let temp = {icon: "warning", title: title};
                BARTENDER.Helpers.Swal.compile(temp, text, content);
            },
            /**
             * Error Icon Swal <br>
             * Title: Error
             * @param text      {String|Boolean}    Text for Swal or empty for no-text
             * @param content   {Object|Boolean}    Alternative Data for Swal Body
             */
            error: function (text = false, content = false) {
                let temp = {icon: "error", title: "Error", dangerMode: true};
                BARTENDER.Helpers.Swal.compile(temp, text, content);
            },
            /**
             * Compiler For Swal <br>
             * Ensures all Swal that use this share styles
             * @param data      {Object}            Title and Icon Data
             * @param text      {String|Boolean}    Text for Swal or empty for no-text
             * @param content   {Object|Boolean}    Alternative Data for Swal Body
             */
            compile: function (data, text = false, content = false) {
                data.customClass = 'swal-dark';
                if (content !== false) data.html = content;
                if (text !== false) data.text = text;

                Swal.fire(data);
            },

            // Unique SWAL
            /**
             * Tutorial Swal <br>
             * Opens an extra-wide swal for holding custom content
             * @param title     {String}    Title for Swal
             * @param content   {Object}    HTML Element for Swal Body
             */
            tutorial: function (title, content) {
                Swal.fire({title: title, content: content, className: 'swal-dark-wide',});
            },

            // Complex SWAL
            /**
             * Confirmation <br>
             * These display a Swal Message with 2 buttons, if confirmed then an action with occur
             */
            Confirmation: {
                /**
                 * Delete Confirmation Swal <br>
                 * Icon: Warning <br>
                 * Title: Are you Sure?
                 * @param name          {String}    You will not be able to recover {name}
                 * @param successAction {Function}  Action to take if confirmed
                 * @param failAction    {Function|Boolean}  Action to take if not confirmed or empty for nothing
                 */
                delete: function (name, successAction, failAction = false) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: `Once deleted, you will not be able to recover ${name}!`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, permanently delete them!',
                        className: 'swal-dark-confirm-delete',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            successAction();
                        } else if(failAction !== false) {
                            failAction();
                        }
                    });
                },

                /**
                 * Removal Confirmation Swal <br>
                 * Icon: Warning <br>
                 * Title: Are you Sure? <br>
                 * Like Delete except it says remove
                 * @param name          {String}    You will not be able to recover {name}
                 * @param successAction {Function}  Action to take if confirmed
                 * @param failAction    {Function|Boolean}  Action to take if not confirmed or empty for nothing
                 */
                remove: function (name, successAction, failAction = false) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: `Once removed, you will not be able to recover the data from ${name}!`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, remove them!',
                        className: 'swal-dark-confirm-delete',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            successAction();
                        } else if(failAction !== false) {
                            failAction();
                        }
                    });
                },

                /**
                 * Special Confirmation Swal <br>
                 * Icon: Info <br>
                 * @param title         {String}    Title for Swal
                 * @param text          {String}    Text for Swal
                 * @param content       {Object}    HTML Element for Swal
                 * @param successAction {Function}  Action to take if confirmed
                 * @param failAction    {Function|Boolean}  Action to take if not confirmed or empty for nothing
                 */
                special: function (title, text, content, successAction, failAction = false) {
                    // TODO: Test and fix custom content
                    Swal.fire({ icon: "info", buttons: true, dangerMode: true, className: 'swal-dark-confirm-delete',
                        title: title, text: text, html: content,
                    }).then((willDelete) => {
                        if (willDelete) {
                            successAction();
                        } else {
                            if(failAction !== false) {
                                failAction();
                            }
                        }
                    });
                },
            },
            /**
             * Reload <br>
             * These do what the normal Swals do except afterwards they reload the webpage
             */
            Reload: {
                success: function (text) {
                    let temp = {icon: "info", title: "Success", text: text, className: 'swal-dark'};
                    Swal.fire(temp).then(function () {
                        window.location.reload();
                    });
                },
            },
            /**
             * Redirect <br>
             * These do what the normal Swal does except afterwards they redirect the webpage
             */
            Redirect: {
                success: function (text, href) {
                    let temp = {icon: "info", title: "Success", text: text, className: 'swal-dark'};
                    Swal.fire(temp).then(function () {
                        window.location.href = href;
                    });
                },
            },
        }
    },

    /**
     * Debug <br>
     * Logs and Tracks information for use debugging issues
     */
    Debug: {
        log: [],

        /** Add Debug <br>
         *  Adds the input data to Debug Log as a singular object
         * @param msg       {string}    Core message, what console.log would write out
         * @param source    {string}    Function that threw the message
         * @param data      {object}    Any extra abstract data
         */
        add: function (msg, source, data = {}) {
            BARTENDER.Debug.log.push({message: msg, source: source, data: data})
        },

        getLatest: function (){
            return BARTENDER.Debug.log[(BARTENDER.Debug.log.length - 1)];
        },
    }
}