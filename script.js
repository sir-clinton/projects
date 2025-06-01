(async function () {
    const data = await fetch('./employees.json');
    const res = await data.json();

    let employees = res;
    let selectedEmployeeId = employees[0].id;
    let selectedEmployee = employees;

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
    renderEmployees();

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
            renderEmployees();
            addEmployeeForm.reset();
            addEmployeeModal.style.display = 'none'
    })
    //Add employee end

    //Select Employee logic - START
    employeeList.addEventListener('click', (e)=> {
        if(e.target.tagName === 'SPAN' && selectedEmployeeId !== e.target.id) {
            selectedEmployeeId = e.target.id;
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

            renderEmployees();
        }
    });

    function renderEmployees () {
        employeeList.innerHTML = '';
        employees.forEach(emp => {
            const employee = document.createElement('span');
            employee.classList.add('employees_names--item');
            if(selectedEmployeeId === emp.id) {
                employee.classList.add('selected');
                selectedEmployee = emp;
            }
            employee.setAttribute('id', emp.id);
            employee.innerHTML = `${emp.firstName} ${emp.lastName}  
            <i class="employeeDelete">&#10060;</i>`; 
        employeeList.append(employee); 
        })
    };

    //rendersing single employee logic -END
    const renderSingleEmployee = () =>{
        //Employee delete logic 
        
        employeeInfo.innerHTML = `
         <img src="${selectedEmployee.imageUrl}" /> 
        <span class="employees__single--heading"> 
        ${selectedEmployee.firstName} ${selectedEmployee.lastName}  
            (${selectedEmployee.age}) 
        </span> 
        <span>${selectedEmployee.address}</span> 
        <span>${selectedEmployee.email}</span> 
        <span>Mobile - ${selectedEmployee.contactNumber}</span> 
        <span>DOB - ${selectedEmployee.dob}</span> 
        `;

    }
    renderSingleEmployee()
   
})()
