const miladi_month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const shamsi_month_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
const shamsi_months = ["حمل", "ثور", "جوزا", "سرطان","اسد","سنبله","میزان","عقرب","قوس","جدی","دلو","حوت"]
const miladi_months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const shamsiDateSpan = document.getElementById('shamsiDate')
const miladiDateSpan = document.getElementById('miladiDate')
const daysDiv = document.getElementById('days')
const nextBtn = document.getElementById('nextMonth')
const previousBtn = document.getElementById('previousMonth')

let unixdate = Date.now()
let today = new Date(unixdate)
let todayDate = today.toLocaleDateString()
let todayArray = todayDate.split('/')
let miladi_m = todayArray[0]
let miladi_d = todayArray[1]
let miladi_y = todayArray[2]

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
let sD = shamsi_day_no+1

shamsiDateSpan.textContent=sY+' '+shamsi_months[sM-1]
let sMiladiArray = dateToMiladi(sY,sM,1)
let eMiladiArray = dateToMiladi(sY,sM,shamsi_month_days[sM-1])
miladiDateSpan.textContent= miladi_months[sMiladiArray[1]-1]+'-'+miladi_months[eMiladiArray[1]-1]+ ' '+sMiladiArray[0]

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

for(let i = 1; i <= shamsi_month_days[sM-1]; i++){
    let squar = document.createElement('span')
    squar.classList.add('day')
    if(i==sD){
        squar.classList.add('current-day')
    }
    squar.textContent=i
    daysDiv.appendChild(squar)

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