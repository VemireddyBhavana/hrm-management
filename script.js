// ==========================================
// ANIMATED COUNTER
// ==========================================

function animateCounter(id,start,end,duration){

    let current=start;

    const increment=(end-start)/(duration/20);

    const element=document.getElementById(id);

    const timer=setInterval(()=>{

        current+=increment;

        if(current>=end){

            current=end;

            clearInterval(timer);

        }

        element.innerHTML=Math.floor(current);

    },20);

}

// ==========================================
// EMPLOYEE DATA
// ==========================================

let employees = JSON.parse(localStorage.getItem("employees")) || [

{

name:"John Smith",

department:"HR",

position:"Manager",

status:"Present"

},

{

name:"Emma Watson",

department:"IT",

position:"Developer",

status:"Present"

},

{

name:"David Miller",

department:"Finance",

position:"Accountant",

status:"Leave"

},

{

name:"Sophia Lee",

department:"Marketing",

position:"Executive",

status:"Present"

}

];

// ==========================================
// EDIT EMPLOYEE INDEX
// ==========================================

let editIndex = -1;

const defaultProfileImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%231e293b'/%3E%3Ccircle cx='25' cy='19' r='8' fill='%2338bdf8'/%3E%3Cpath d='M10 45c2-10 28-10 30 0' fill='%2338bdf8'/%3E%3C/svg%3E";

function saveEmployees(){

    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );

}

function showToast(message){

    const toast=document.getElementById("toast");

    toast.innerHTML=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

function addNotification(message){

    const list=document.getElementById("notificationList");

    const item=document.createElement("div");

    item.className="notification-item";

    item.innerHTML=`

        <i class="fa-solid fa-bell"></i>

        <div>
            <p></p>
        </div>

    `;

    item.querySelector("p").textContent=message;

    list.prepend(item);

}

function updateDashboard(){

    document.getElementById("employeeCount").innerHTML=employees.length;

    let present=employees.filter(emp=>emp.status==="Present").length;

    let leave=employees.filter(emp=>emp.status==="Leave").length;

    document.getElementById("presentCount").innerHTML=present;

    document.getElementById("leaveCount").innerHTML=leave;

    animateCounter("employeeCount",0,employees.length,2000);

    animateCounter("presentCount",0,present,2000);

    animateCounter("leaveCount",0,leave,1500);

}

const table=document.getElementById("employeeTable");
function displayEmployees(data = employees){

    table.innerHTML = "";

    data.forEach((emp)=>{

        const employeeIndex = employees.indexOf(emp);

        table.innerHTML += `

        <tr>

            <td>

                <div class="employee-info">

                    <img
                        src="${emp.image || defaultProfileImage}"
                        class="profile-img"
                        alt="${emp.name} profile photo"
                    >

                    <span>${emp.name}</span>

                </div>

            </td>

            <td>${emp.department}</td>

            <td>${emp.position}</td>

            <td>${emp.status}</td>

            <td>

                <button
                    class="action-btn edit"
                    onclick="editEmployee(${employeeIndex})"
                >

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteEmployee(${employeeIndex})"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

function deleteEmployee(index){

    if(confirm("Delete this employee?")){

        employees.splice(index,1);

        saveEmployees();

        displayEmployees();

        updateDashboard();

        showToast("Employee Deleted");

        addNotification("Employee removed.");

    }

}

function editEmployee(index){

    editIndex = index;

    document.getElementById("modalTitle").innerHTML = "Edit Employee";

    document.getElementById("empName").value = employees[index].name;

    document.getElementById("empDepartment").value = employees[index].department;

    document.getElementById("empPosition").value = employees[index].position;

    document.getElementById("empStatus").value = employees[index].status;

    modal.style.display="flex";

}

displayEmployees();
updateDashboard();

const search=document.getElementById("searchEmployee");

search.addEventListener("keyup",()=>{

const value=search.value.toLowerCase();

const filtered=employees.filter(emp=>

emp.name.toLowerCase().includes(value) ||

emp.department.toLowerCase().includes(value) ||

emp.position.toLowerCase().includes(value)

);

displayEmployees(filtered);

});

// ==========================================
// ADD EMPLOYEE
// ==========================================

const modal = document.getElementById("employeeModal");

const addBtn = document.getElementById("addEmployeeBtn");

const closeModal = document.querySelector(".close-modal");

const form = document.getElementById("employeeForm");

addBtn.onclick = () => {

    editIndex = -1;

    form.reset();

    document.getElementById("modalTitle").innerHTML = "Add Employee";

    modal.style.display = "flex";

};

closeModal.onclick = () => {

    modal.style.display = "none";

};

window.onclick = (e) => {

    if(e.target == modal){

        modal.style.display = "none";

    }

};

function readImageFile(file){

    return new Promise((resolve,reject)=>{

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = () => reject(reader.error);

        reader.readAsDataURL(file);

    });

}

form.addEventListener("submit",async (e)=>{

    e.preventDefault();

    const imageInput = document.getElementById("empImage");

    let imageURL = editIndex === -1
        ? ""
        : employees[editIndex].image || "";

    if(imageInput.files.length > 0){

        imageURL = await readImageFile(imageInput.files[0]);

    }

    const employeeData = {

        name:document.getElementById("empName").value,

        department:document.getElementById("empDepartment").value,

        position:document.getElementById("empPosition").value,

        status:document.getElementById("empStatus").value,

        image:imageURL

    };

    if(editIndex === -1){

        employees.push(employeeData);

        showToast("Employee Added Successfully");

        addNotification("New employee added.");

    }
    else{

        employees[editIndex] = employeeData;

        showToast("Employee Updated Successfully");

        editIndex = -1;

    }

    saveEmployees();

    displayEmployees();

    updateDashboard();

    form.reset();

    modal.style.display="none";

    document.getElementById("modalTitle").innerHTML = "Add Employee";

});

const themeBtn=document.querySelector(".theme-btn");

if(localStorage.getItem("theme")==="light"){

    document.body.classList.add("light");

}

themeBtn.onclick=()=>{

    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light") ? "light" : "dark"
    );

};

let leaveRequests =
    JSON.parse(localStorage.getItem("leaveRequests")) || [];

const leaveModal = document.getElementById("leaveModal");
const leaveBtn = document.getElementById("leaveBtn");
const closeLeave = document.querySelector(".closeLeave");
const leaveForm = document.getElementById("leaveForm");
const leaveTable = document.getElementById("leaveTable");

leaveBtn.onclick=()=>{

    leaveModal.style.display="flex";

};

closeLeave.onclick=()=>{

    leaveModal.style.display="none";

};

window.addEventListener("click",(e)=>{

    if(e.target==leaveModal){

        leaveModal.style.display="none";

    }

});

leaveForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const from = document.getElementById("leaveFrom").value;
    const to = document.getElementById("leaveTo").value;

    if(to < from){

        showToast("End date must be after start date");

        return;

    }

    leaveRequests.push({

        employee:document.getElementById("leaveEmployee").value,
        from,
        to,
        reason:document.getElementById("leaveReason").value,
        status:"Pending"

    });

    saveLeaveRequests();

    displayLeave();

    leaveForm.reset();

    leaveModal.style.display="none";

    showToast("Leave Request Submitted");

});

function saveLeaveRequests(){

    localStorage.setItem(
        "leaveRequests",
        JSON.stringify(leaveRequests)
    );

}

function displayLeave(){

    leaveTable.innerHTML="";

    leaveRequests.forEach((leave,index)=>{

        const statusClass = leave.status.toLowerCase();

        leaveTable.innerHTML+=`

        <tr>

            <td>${leave.employee}</td>
            <td>${leave.from}</td>
            <td>${leave.to}</td>
            <td>${leave.reason}</td>
            <td class="${statusClass}">${leave.status}</td>
            <td class="leave-actions">

                <button
                    onclick="approveLeave(${index})"
                    ${leave.status !== "Pending" ? "disabled" : ""}
                >
                    Approve
                </button>

                <button
                    onclick="rejectLeave(${index})"
                    ${leave.status !== "Pending" ? "disabled" : ""}
                >
                    Reject
                </button>

            </td>

        </tr>

        `;

    });

}

function approveLeave(index){

    if(leaveRequests[index].status !== "Pending"){

        return;

    }

    leaveRequests[index].status="Approved";

    saveLeaveRequests();

    displayLeave();

    showToast("Leave Approved");

    addNotification("Leave request approved.");

}

function rejectLeave(index){

    if(leaveRequests[index].status !== "Pending"){

        return;

    }

    leaveRequests[index].status="Rejected";

    saveLeaveRequests();

    displayLeave();

    showToast("Leave Rejected");

    addNotification("Leave request rejected.");

}

displayLeave();

// ==========================================
// DEPARTMENTS
// ==========================================

const defaultDepartments = [

    {
        name:"Human Resources",
        manager:"John Smith",
        employees:20
    },

    {
        name:"Information Technology",
        manager:"Emma Watson",
        employees:45
    },

    {
        name:"Finance",
        manager:"David Miller",
        employees:18
    }

];

const storedDepartments = JSON.parse(
    localStorage.getItem("departments") || "null"
);

let departments = storedDepartments && storedDepartments.length > 0
    ? storedDepartments
    : defaultDepartments;

let departmentEditIndex=-1;

const departmentModal=document.getElementById("departmentModal");
const departmentTable=document.getElementById("departmentTable");
const departmentForm=document.getElementById("departmentForm");
const addDepartmentBtn=document.getElementById("addDepartmentBtn");
const closeDepartment=document.querySelector(".closeDepartment");

addDepartmentBtn.onclick=()=>{

    departmentEditIndex=-1;

    departmentForm.reset();

    document.getElementById("departmentTitle").innerHTML="Add Department";

    departmentModal.style.display="flex";

};

closeDepartment.onclick=()=>{

    departmentModal.style.display="none";

};

window.addEventListener("click",(e)=>{

    if(e.target===departmentModal){

        departmentModal.style.display="none";

    }

});

function saveDepartments(){

    localStorage.setItem(
        "departments",
        JSON.stringify(departments)
    );

}

function displayDepartments(data=departments){

    departmentTable.innerHTML="";

    data.forEach((dept)=>{

        const departmentIndex = departments.indexOf(dept);

        departmentTable.innerHTML+=`

        <tr>

            <td>${dept.name}</td>
            <td>${dept.manager}</td>
            <td>${dept.employees}</td>
            <td class="department-actions">

                <button
                    class="action-btn edit"
                    onclick="editDepartment(${departmentIndex})"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteDepartment(${departmentIndex})"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>

        </tr>

        `;

    });

}

departmentForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const department={

        name:document.getElementById("departmentName").value,
        manager:document.getElementById("departmentManager").value,
        employees:Number(document.getElementById("departmentEmployees").value)

    };

    if(departmentEditIndex===-1){

        departments.push(department);

        showToast("Department Added");

    }
    else{

        departments[departmentEditIndex]=department;

        showToast("Department Updated");

        departmentEditIndex=-1;

    }

    saveDepartments();

    displayDepartments();

    departmentForm.reset();

    departmentModal.style.display="none";

});

function editDepartment(index){

    departmentEditIndex=index;

    const dept=departments[index];

    document.getElementById("departmentTitle").innerHTML="Edit Department";

    document.getElementById("departmentName").value=dept.name;

    document.getElementById("departmentManager").value=dept.manager;

    document.getElementById("departmentEmployees").value=dept.employees;

    departmentModal.style.display="flex";

}

function deleteDepartment(index){

    if(confirm("Delete Department?")){

        departments.splice(index,1);

        saveDepartments();

        displayDepartments();

        showToast("Department Deleted");

    }

}

document.getElementById("departmentSearch")
    .addEventListener("keyup",(e)=>{

        const value=e.target.value.toLowerCase();

        const filtered=departments.filter(dept=>

            dept.name.toLowerCase().includes(value) ||

            dept.manager.toLowerCase().includes(value)

        );

        displayDepartments(filtered);

    });

displayDepartments();

const ctx=document.getElementById("performanceChart");

new Chart(ctx,{

    type:"bar",

    data:{

        labels:["HR","IT","Finance","Marketing","Sales"],

        datasets:[{

            label:"Performance",

            data:[85,95,75,80,90]

        }]

    }

});

// ==========================================
// ANALYTICS CHARTS
// ==========================================

new Chart(document.getElementById("departmentChart"),{

    type:"bar",

    data:{

        labels:departments.map(department=>department.name),

        datasets:[{

            label:"Employees",

            data:departments.map(department=>department.employees),

            backgroundColor:["#2563EB","#10B981","#F59E0B","#EF4444","#8B5CF6"]

        }]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        animation:{duration:1200}

    }

});

new Chart(document.getElementById("statusChart"),{

    type:"pie",

    data:{

        labels:["Present","Leave","Absent"],

        datasets:[{

            data:[
                employees.filter(employee=>employee.status==="Present").length,
                employees.filter(employee=>employee.status==="Leave").length,
                employees.filter(employee=>employee.status==="Absent").length
            ],

            backgroundColor:["#10B981","#F59E0B","#EF4444"]

        }]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        animation:{duration:1200}

    }

});

new Chart(document.getElementById("hiringChart"),{

    type:"line",

    data:{

        labels:["Jan","Feb","Mar","Apr","May","Jun"],

        datasets:[{

            label:"Hiring",

            data:[5,12,8,15,10,20],

            borderColor:"#2563EB",

            fill:false,

            tension:.4

        }]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        animation:{duration:1200}

    }

});

new Chart(document.getElementById("payrollChart"),{

    type:"line",

    data:{

        labels:["Jan","Feb","Mar","Apr","May","Jun"],

        datasets:[{

            label:"Payroll",

            data:[6,6.5,7,7.2,7.8,8.2],

            borderColor:"#8B5CF6",

            backgroundColor:"rgba(139,92,246,.3)",

            fill:true,

            tension:.4

        }]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        animation:{duration:1200}

    }

});

// ==========================================
// EXPORT PDF
// ==========================================

document.getElementById("exportPDF").addEventListener("click",()=>{

    if(!window.jspdf || typeof window.jspdf.jsPDF !== "function"){

        showToast("PDF library unavailable");

        return;

    }

    const {jsPDF}=window.jspdf;
    const doc=new jsPDF();

    doc.setFontSize(20);
    doc.text("HRM Employee Report",14,20);

    doc.autoTable({

        head:[["Name","Department","Position","Status"]],

        body:employees.map(employee=>[
            employee.name,
            employee.department,
            employee.position,
            employee.status
        ]),

        startY:30

    });

    doc.save("Employee_Report.pdf");

    showToast("PDF Downloaded");

});

// ==========================================
// EXPORT EXCEL
// ==========================================

function escapeCsv(value){

    return `"${String(value).replace(/"/g,'""')}"`;

}

document.getElementById("exportExcel").addEventListener("click",()=>{

    const rows=[
        ["Name","Department","Position","Status"],
        ...employees.map(employee=>[
            employee.name,
            employee.department,
            employee.position,
            employee.status
        ])
    ];

    const csv=rows
        .map(row=>row.map(escapeCsv).join(","))
        .join("\n");

    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url=window.URL.createObjectURL(blob);
    const link=document.createElement("a");

    link.href=url;
    link.download="Employee_Report.csv";
    link.click();

    window.URL.revokeObjectURL(url);

    showToast("Excel Downloaded");

});

// ==========================================
// EMPLOYEE FILTERS
// ==========================================

const departmentFilter=document.getElementById("departmentFilter");
const statusFilter=document.getElementById("statusFilter");

function populateDepartmentFilter(){

    const names=[
        ...new Set([
            ...departments.map(department=>department.name),
            ...employees.map(employee=>employee.department)
        ])
    ];

    departmentFilter.innerHTML='<option value="">All Departments</option>';

    names.forEach(name=>{

        departmentFilter.innerHTML+=`<option value="${name}">${name}</option>`;

    });

}

function applyFilters(){

    let filtered=[...employees];

    if(departmentFilter.value){

        filtered=filtered.filter(employee=>
            employee.department===departmentFilter.value
        );

    }

    if(statusFilter.value){

        filtered=filtered.filter(employee=>
            employee.status===statusFilter.value
        );

    }

    const searchValue=search.value.toLowerCase();

    if(searchValue){

        filtered=filtered.filter(employee=>
            employee.name.toLowerCase().includes(searchValue) ||
            employee.department.toLowerCase().includes(searchValue) ||
            employee.position.toLowerCase().includes(searchValue)
        );

    }

    displayEmployees(filtered);

}

departmentFilter.onchange=applyFilters;
statusFilter.onchange=applyFilters;
search.onkeyup=applyFilters;
populateDepartmentFilter();

// ==========================================
// ATTENDANCE CALENDAR
// ==========================================

const calendar=document.getElementById("calendar");
const monthYear=document.getElementById("monthYear");
let currentDate=new Date();
let attendance=JSON.parse(localStorage.getItem("attendance") || "{}");

function renderCalendar(){

    calendar.innerHTML="";

    const year=currentDate.getFullYear();
    const month=currentDate.getMonth();
    const firstDay=new Date(year,month,1).getDay();
    const totalDays=new Date(year,month+1,0).getDate();

    monthYear.innerHTML=currentDate.toLocaleString("default",{
        month:"long",
        year:"numeric"
    });

    for(let i=0;i<firstDay;i++){

        calendar.innerHTML+="<div></div>";

    }

    for(let day=1;day<=totalDays;day++){

        const dateKey=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const dayElement=document.createElement("div");

        dayElement.className="day";
        dayElement.textContent=day;
        dayElement.setAttribute("role","button");
        dayElement.setAttribute("tabindex","0");

        if(attendance[dateKey]){

            dayElement.classList.add(attendance[dateKey]);

        }

        const markAttendance=()=>{

            const status=prompt("Enter Attendance:\nPresent\nAbsent\nLeave");
            const normalized=status ? status.trim().toLowerCase() : "";

            if(["present","absent","leave"].includes(normalized)){

                attendance[dateKey]=normalized;

                localStorage.setItem("attendance",JSON.stringify(attendance));

                renderCalendar();

            }

        };

        dayElement.onclick=markAttendance;
        dayElement.onkeydown=(event)=>{

            if(event.key==="Enter" || event.key===" "){

                markAttendance();

            }

        };

        calendar.appendChild(dayElement);

    }

}

document.getElementById("prevMonth").onclick=()=>{

    currentDate.setMonth(currentDate.getMonth()-1);
    renderCalendar();

};

document.getElementById("nextMonth").onclick=()=>{

    currentDate.setMonth(currentDate.getMonth()+1);
    renderCalendar();

};

renderCalendar();

// ==========================================
// EMAIL NOTIFICATION UI
// ==========================================

document.getElementById("sendEmail").onclick=()=>{

    const email=document.getElementById("emailTo").value.trim();
    const subject=document.getElementById("emailSubject").value.trim();
    const message=document.getElementById("emailMessage").value.trim();

    if(email && subject && message){

        showToast("Email UI Ready");
        addNotification(`Email prepared for ${email}`);

    }
    else{

        showToast("Please fill all fields");

    }

};

// ==========================================
// LOADING SCREEN
// ==========================================

window.addEventListener("load",()=>{

    const loader=document.getElementById("loader");

    setTimeout(()=>{

        loader.classList.add("hidden");

        setTimeout(()=>loader.remove(),500);

    },500);

});

