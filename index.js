const miladi_month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const shamsi_month_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
const shamsi_months = ["حمل", "ثور", "جوزا", "سرطان","اسد","سنبله","میزان","عقرب","قوس","جدی","دلو","حوت"]
const miladi_months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const shamsiDateSpan = document.getElementById('shamsiDate')
const miladiDateSpan = document.getElementById('miladiDate')
const daysDiv = document.getElementById('days')
const nextBtn = document.getElementById('nextMonth')
const previousBtn = document.getElementById('previousMonth')
const modalOpen = document.getElementById('modalBtn')
let selectedMonth = 0
let selectedYear = 0
let currentSYear = 0
let currentSMonth = 0
let currentSDay = 0
let isCurrentMoth = true
let paired = []

nextBtn.addEventListener('click',loadNextMonth)
previousBtn.addEventListener('click',loadPreviousMonth)
shamsiDateSpan.addEventListener('click',LoadModal)
modalOpen.addEventListener('click',renderModal)
//according to today's date, render the current month
let unixdate = Date.now()
let today = new Date(unixdate)
let todayDate = today.toLocaleDateString()
let todayArray = todayDate.split('/')
let miladi_m = todayArray[0]
let miladi_d = todayArray[1]
let miladi_y = todayArray[2]

let shamsiDate = dateToShamsi(miladi_y,miladi_m,miladi_d)
renderCalendar(shamsiDate[0],shamsiDate[1],shamsiDate[2])

function dateToShamsi(miladi_y,miladi_m,miladi_d){

    let mY = miladi_y-1600
    let mM = miladi_m-1
    let mD = miladi_d-1
    let miladi_day_no = 365*mY+div(mY+3,4)-div(mY+99,100)+div(mY+399,400);

    for (let i=0; i < mM; ++i){
        miladi_day_no += miladi_month_days[i]
    }

    if (mM>1 && ((mY%4==0 && mY%100!=0) || ($mY%400==0))){
        /* leap and after Feb */
        ++miladi_day_no
    }

    miladi_day_no += mD

    let shamsi_day_no = miladi_day_no-79
    let shamsi_np = div(shamsi_day_no, 12053)

    shamsi_day_no %= 12053

    let sY = 979+33*shamsi_np+4*div(shamsi_day_no,1461)

    shamsi_day_no %= 1461;
    if (shamsi_day_no >= 366) {
        sY += div(shamsi_day_no-1, 365);
        shamsi_day_no = (shamsi_day_no-1)%365;
    }

    let day = 0;
    for (let i = 0; i < 11 && shamsi_day_no >= shamsi_month_days[i]; ++i) {
        shamsi_day_no -= shamsi_month_days[i];
        day = i+1 
    }
    let sM = day + 1
    selectedMonth = sM
    selectedYear = sY
    currentSMonth = sM
    currentSYear = sY
    let sD = shamsi_day_no+1
    currentSDay = sD
    return [sY,sM,sD]
}
function renderCalendar(sY,sM,sD){
    if(sM == currentSMonth || sM == 0){
        isCurrentMoth = true
    }
    shamsiDateSpan.textContent=sY+' '+shamsi_months[sM-1]//shamsi month header
    let sMiladiArray = dateToMiladi(sY,sM,1)
    let shamsiLeapMonth = shamsi_month_days[sM-1]
    if(sM ==12 && shamsiIsLeap(sY)){//month 12 and leap year
        shamsiLeapMonth = 30
    }
    let eMiladiArray = dateToMiladi(sY,sM,shamsiLeapMonth)
    //miladi month header
    miladiDateSpan.textContent= miladi_months[sMiladiArray[1]-1]+'-'+miladi_months[eMiladiArray[1]-1]+ ' '+sMiladiArray[0]
    //pairing shamsi with correspond miladi day
    pairShamsiWithMiladi(sMiladiArray[0],sMiladiArray[1],sMiladiArray[2],eMiladiArray[2])
    //finding the first day of shamsi of the current month
    //0:sun ... 6: sat
    let sWeekDay = new Date(sMiladiArray[0],sMiladiArray[1]-1,sMiladiArray[2]).getDay()
    let eWeekDay = new Date(eMiladiArray[0],eMiladiArray[1]-1,eMiladiArray[2]).getDay()
    if(sWeekDay != 6){
        for(let j = 0;j<=sWeekDay;j++){
            let squar = document.createElement('span')
            squar.classList.add('day')
            daysDiv.appendChild(squar)
        }
    }

    for(let i = 1; i <= shamsiLeapMonth; i++){
        let squar = document.createElement('div')
        squar.setAttribute('id','day_'+i)
        squar.classList.add('day')
        if(i==currentSDay && isCurrentMoth){
            squar.classList.add('current-day')
        }
        daysDiv.appendChild(squar)
        let sSpan = document.createElement('span')
        sSpan.classList.add('shamsi_day')
        sSpan.textContent=i
        document.getElementById('day_'+i).appendChild(sSpan)
        let mSpan = document.createElement('span')
        mSpan.classList.add('miladi_day')
        mSpan.textContent=paired[i-1]
        document.getElementById('day_'+i).appendChild(mSpan)
        

    }
    if(eWeekDay != 6){
        for(let j = eWeekDay;j<5;j++){
            let squar = document.createElement('span')
            squar.classList.add('day')
            daysDiv.appendChild(squar)
        }
    }else{
        let squar = document.createElement('span')
        squar.classList.add('day')
        daysDiv.appendChild(squar)
    }
}

function dateToMiladi(y,m,d){
    let shY = y-979
    let shM = m-1
    let shD = d-1
    let sh_day_no = 365*shY + div(shY,33)*8 + div(((shY%33)+3),4)

    for (let i=0; i < shM; ++i){
        sh_day_no += shamsi_month_days[i]
    }
    
    sh_day_no += shD
    let m_day_no = sh_day_no+79

    let miY = 1600+400*div(m_day_no,146097)
    m_day_no =m_day_no%146097
    let leap=1

    if (m_day_no >= 36525) {
        m_day_no =m_day_no-1
        //36524 = 365*100 + 100/4 - 100/100
        miY +=100* div(m_day_no,36524)
        m_day_no=m_day_no % 36524

        if(m_day_no>=365){
            m_day_no = m_day_no+1
        }
        else{
            leap=0
        }
    }
    miY += 4*div(m_day_no,1461)
    m_day_no %=1461
    if(m_day_no>=366)
    {
        leap=0
        m_day_no=m_day_no-1
        miY += div(m_day_no,365)
        m_day_no=m_day_no %365
    }
    let i=0
    let tmp=0
    while (m_day_no>= (miladi_month_days[i]+tmp))
    {
        if(i==1 && leap==1){
            tmp=1
        }else{
            tmp=0
        }
        m_day_no -= miladi_month_days[i]+tmp
        i=i+1
    }
    let miM=i+1
    let miD=m_day_no+1
    return [miY,miM,miD]
    
}
function div(a, b) {
    return Math.floor(a / b);
 }
 function loadNextMonth(){
    shamsiDateSpan.innerHTML=''
    miladiDateSpan.innerHTML=''
    daysDiv.innerHTML=''
    isCurrentMoth = false

    if(selectedMonth == 12){
        selectedMonth = 1
        selectedYear = selectedYear+1
    }
    else{
        selectedMonth = selectedMonth+1
    }
    
    renderCalendar(selectedYear,selectedMonth,1)
 }
 function loadPreviousMonth(){
    shamsiDateSpan.innerHTML=''
    miladiDateSpan.innerHTML=''
    daysDiv.innerHTML=''
    isCurrentMoth = false

    if(selectedMonth == 1){
        selectedMonth = 12
        selectedYear = selectedYear-1
    }
    else{
        selectedMonth = selectedMonth-1
    }
    
    renderCalendar(selectedYear,selectedMonth,1)
 }
 function pairShamsiWithMiladi(mSY,mSM,mSD,mED){
    let miladiLeapMonth = miladi_month_days[mSM-1]
    if(mSM == 2 && miladiIsLeap(mSY)){
        miladiLeapMonth = 29
    }
    paired = []
    while(mSD <= miladiLeapMonth){
        paired.push(mSD) 
        mSD++
    }
    paired.push(miladi_months[mSM])
    for(let j = 2;j<=mED;j++){
        paired.push(j) 
    }
 }
function miladiIsLeap (year)
{
    return ((year%4) == 0 && ((year%100) != 0 || (year%400) == 0));
}
    
function shamsiIsLeap (year)
{
    year = (year - 474) % 128;
    year = ((year >= 30) ? 0 : 29) + year;
    year = year -Math.floor(year/33) - 1;
    return ((year % 4) == 0);
}
function LoadModal(){
    for(let i=currentSYear-50;i<=currentSYear+1;i++){
        let option = document.createElement('option')
        option.setAttribute('value',i)
        if(i==currentSYear){
            option.setAttribute('selected','selected')
        }
        option.textContent=i
        document.getElementById('select_year').appendChild(option)
    }
    document.getElementById('overlay').style.display='block'
}
 
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById('overlay')) {
        document.getElementById('overlay').style.display= "none";
    }
}
function renderModal(){
    let modalYear = document.getElementById('select_year').value
    let modalMonth = document.getElementById('select_month').value

    shamsiDateSpan.innerHTML=''
    miladiDateSpan.innerHTML=''
    daysDiv.innerHTML=''
    isCurrentMoth = false
    document.getElementById('overlay').style.display= "none";
    renderCalendar(modalYear,modalMonth,1)
}
