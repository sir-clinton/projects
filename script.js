   
    men();
async function men() {
    const data = await fetch('../employees.json');
    const res = await data.json();
    let employees = res;
    let selectedEmployee;
    if(!localStorage.getItem('employees')){
        localStorage.setItem('employees', JSON.stringify(employees))
    }
    employees = localStorage.getItem('employees') ? JSON.parse(localStorage.getItem('employees')) : res;
    let selectedEmployeeId = employees[employees.length-1].id;
    console.log(typeof selectedEmployeeId)

    const employeeList = document.querySelector(
        '.employees_names--list'
    );
    const employeeInfo = document.querySelector(
        '.employees_single--info'
    );

    //Add Employee - START
    const createEmployee = document.querySelector(
        '.createEmployee'
    );



    const addEmployeeModal = 
        document.querySelector(".addEmployee"); 
    const addEmployeeForm = document.querySelector( 
        ".addEmployee_create"
    ); 

    window.deleteEmployee = function (ide){
        if(!confirm(`Would you like to remove "${selectedEmployee.firstName} ${selectedEmployee.lastName}"`)) return;
        console.log(ide);
        employees = employees.filter(el => el.id !== selectedEmployee.id);
        localStorage.setItem('employees', JSON.stringify(employees));
        renderEmployees();
    }

    createEmployee.addEventListener('click', ()=> {
        addEmployeeModal.style.display = 'flex';
    });

    addEmployeeModal.addEventListener('click', (e)=>{
        if(e.target.className === 'addEmployee') {
            addEmployeeModal.style.display = 'none';
        }
    })

    // Set employee age to be entered minimum 18 years 
    const dobInput = document.querySelector(
        '.addEmployee_create--dob'
    );

    dobInput.max = `${
        new Date().getFullYear()-18}-${new Date().toISOString().slice(5, 10)
    }`;

    addEmployeeForm.addEventListener('submit', (e)=> {
        e.preventDefault();
        const formData = new FormData(addEmployeeForm);
        let empData = {};
        console.log([...formData])
        const values = [...formData.entries()];
        console.log(values);
        values.forEach(emp => {
            empData[emp[0]] = emp[1];
        });        
        empData.id = employees[employees.length - 1].id + 1;
        empData.age = new Date().getFullYear() -
        parseInt(empData.dob.slice(0, 4), 10);
        empData.imageUrl  = 
            empData.imageUrl || 'gfg.jpeg';
            employees.push(empData);
            localStorage.setItem('employees', JSON.stringify(employees))
            renderEmployees();
            addEmployeeForm.reset();
            addEmployeeModal.style.display = 'none'
            const selectedElement = document.getElementsByClassName('selected')[0]
           if(selectedElement) selectedElement.classList.remove('selected')
            document.getElementById(empData.id).classList.add('selected')
          
    })
    //Add employee end

    //Select Employee logic - START
    employeeList.addEventListener('click', (e)=> {
        if(e.target.tagName === 'SPAN' && selectedEmployeeId !== e.target.id) {
            selectedEmployeeId = e.target.id;
           const selectedElement = document.getElementsByClassName('selected')[0]
           if(selectedElement) selectedElement.classList.remove('selected')
            document.getElementById(e.target.id).classList.add('selected')
            employees.forEach(el => {
                if(selectedEmployeeId == el.id) selectedEmployee = el;
            });
                renderSingleEmployee();
        }
        if (e.target.tagName === "I") { 
            employees = employees.filter( 
                (emp) => 
                    String(emp.id) !== 
                    e.target.parentNode.id 
            ); 
            localStorage.setItem('employees', JSON.stringify(employees));
        renderEmployees();
        }
    });

    function renderEmployees () {
        employeeList.innerHTML = '';
        employees.forEach(emp => {
            const employee = document.createElement('span');
            employee.classList.add('employees_names--item');
            if(selectedEmployeeId === emp.id) {
                selectedEmployee = emp;
                employee.classList.add('selected')

            }
            employee.setAttribute('id', emp.id);
            employee.innerHTML = `${emp.firstName} ${emp.lastName}  
            <i class="employeeDelete">&#10060;</i>`; 
        employeeList.insertBefore(employee, employeeList.firstChild); 
        })
    };

    window.editEmployee = function(id){

        document.getElementById('save').style.display = 'block';
        document.getElementById('edit').style.display = 'none';
        document.querySelector('#address').contentEditable = 'true';
        document.querySelector('#firstName').contentEditable = 'true';
        document.querySelector('#firstName').focus();
        document.querySelector('#lastName').contentEditable = 'true';  
        document.querySelector('#age').contentEditable = 'true';
        document.querySelector('#email').contentEditable = 'true';
        document.querySelector('#mobile').contentEditable = 'true';
        document.querySelector('#dob').contentEditable = 'true';
        
        
    }

    window.saveEmployee = function(id) {
        document.getElementById('save').style.display = 'none';
        document.getElementById('edit').style.display = 'block';
        document.querySelector('#address').contentEditable = 'false';
        document.querySelector('#email').contentEditable = 'false';
        document.querySelector('#mobile').contentEditable = 'false';
         document.querySelector('#firstName').contentEditable = 'false';
        document.querySelector('#lastName').contentEditable = 'false';  
       
        document.querySelector('#dob').contentEditable = 'false';        

                
        
        employees.forEach(el =>{
            if(el.id === id){
                selectedEmployeeId = id;
                el.firstName = document.querySelector('#firstName').textContent;
                el.lastName = document.querySelector('#lastName').textContent;

                el.email = document.querySelector('#email').textContent
                el.contactNumber = document.querySelector('#mobile').textContent  
                el.dob = document.querySelector('#dob').textContent
                el.address = document.querySelector('#address').textContent
                    }
        })
         
               
        localStorage.setItem('employees', JSON.stringify(employees));
        renderEmployees();
    }
    //rendersing single employee logic -END
    const renderSingleEmployee = () =>{
        employeeInfo.innerHTML = '';
        //Employee delete logic 
        employeeInfo.innerHTML = `
        <input type='file' hidden id='chooseImg'>
        <div class='imgContainer'>
         <img id=${selectedEmployee.id} style='cursor: pointer' src="${selectedEmployee.imageUrl}" /></div>
         <div id='options'><button onclick='deleteEmployee(${selectedEmployee.id})'>DELETE</button><button onclick="saveEmployee(${selectedEmployee.id})" id='save' >SAVE</button><button id='edit' onclick="editEmployee(${selectedEmployee.id})">EDIT</button></div>
        <div id="employee-info" style='text-align: left; display: flex; flex-direction: column;gap: 4px;'> 
            <span class="employees__single--heading"><span id='firstName'>${selectedEmployee.firstName}</span> <span id='lastName'>${ selectedEmployee.lastName}</span> <span id='age'>(${selectedEmployee.age})</span></span> 
        <span id='address'>${selectedEmployee.address}</span> 
        <span><span  id='email'>${selectedEmployee.email}</span></span> 
        <span>Mobile - <span  id='mobile'> ${selectedEmployee.contactNumber}</span></span> 
        <span> DOB - <span  id='dob'>${selectedEmployee.dob}</span></span> 
        </div>`;

        const employeeInfoImg = employeeInfo.querySelector('.imgContainer').addEventListener('click', changeImage);
        
    }

    function changeImage(){
        let btni = document.querySelector('#chooseImg')
        btni.onchange = function(event) {
            const file = event.target.files[0];

            const reader = new FileReader();

            reader.onload = function(el){
                employeeInfo.querySelector('img').src = el.target.result
                employees.forEach(employee => {
                    if(employee.id === Number(employeeInfo.querySelector('img').id)){
                        employee.imageUrl = el.target.result;
                    }
                })
                localStorage.setItem('employees', JSON.stringify(employees));
            }

            reader.readAsDataURL(file);
        }
        btni.click();
    }
    renderEmployees();
    renderSingleEmployee();
}
