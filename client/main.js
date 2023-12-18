import "./style.css";
import TomSelect from "tom-select";
import { Notification } from "./scripts/notification";
import Inputmask from "inputmask";
import JustValidate from "just-validate";

const bookingComediansList =  document.querySelector('.booking__comedians-list');
const MAX_COMEDIANS = 6
const bookingForm = document.querySelector('.booking__form');

const notification =  Notification.getInstance();

const createComedianBlock =(comedians)=>{
    const bookingComedian = document.createElement('li');
    bookingComedian.classList.add("booking__comedian");

    const bookingSelectComedian = document.createElement("select");
    bookingSelectComedian.classList.add("booking__select","booking__select_comedian");

    const bookingSelectTime = document.createElement("select");
    bookingSelectTime.classList.add("booking__select","booking__select_time");

    const inputHidden = document.createElement("input");
    inputHidden.type = "hidden";
    inputHidden.name = "booking";

    const bookingHall = document.createElement('button');
    bookingHall.classList.add("booking__hall");
    bookingHall.type = 'button';

    bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden);
    
      const bookingTomSelectComedian =  new TomSelect(bookingSelectComedian, {
        hideSelected: true,
        placeholder: "select actor",
        options: comedians.map (item => ({
            value: item.id,
            text: item.comedian
        }))
    });
    const bookingTomSelectTime =  new TomSelect(bookingSelectTime,
        {hideSelected: true,
        placeholder: "time"});
        bookingTomSelectTime.disable();
        bookingTomSelectComedian.on("change", (id)=>{
            bookingTomSelectTime.enable();
            bookingSelectComedian.blur();
            const {performances} = comedians.find((item)=> item.id === id);
            bookingTomSelectTime.clear();
            bookingTomSelectTime.clearOptions();
            bookingTomSelectTime.addOptions(
                performances.map((item)=> ({
                    value: item.time,
                    text: item.time
                }))
            );
           bookingHall.remove()
        })
    bookingTomSelectTime.on("change", (time)=>{
        if (!time){
            return;
        }
        const idComedian = bookingTomSelectComedian.getValue();
        const {performances} = comedians.find((item)=> item.id === idComedian);
        const {hall} = performances.find((item)=> item.time === time);
        console.log(hall);
          inputHidden.value = `${idComedian}, ${time}`

        bookingSelectTime.blur();
        bookingHall.textContent = hall;
        bookingComedian.append(bookingHall);


    });

    const createNextBookingComedian = ()=>{
        if(bookingComediansList.children.length < MAX_COMEDIANS){
            const newComedianBlock = createComedianBlock(comedians);
            bookingComediansList.append(newComedianBlock);
           }       
            }

    bookingTomSelectTime.on("change",createNextBookingComedian)

    return bookingComedian
}
    


  const getComedians = async ()=>{
    const response = await fetch ('http://localhost:8080/comedians');
  return  response.json()
  }

const init = async () =>{
    const countComedians = document.querySelector( '.event__info-item_comedians .event__info-number')
 const comedians = await getComedians();
 countComedians.textContent = comedians.length;
 const comedianBlock = createComedianBlock(comedians)
 bookingComediansList.append(comedianBlock);

 bookingForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const data = {booking: []};
    const times = new Set();
    new FormData(bookingForm).forEach((value, field)=>{
       if(field === 'booking'){
        const [comedian, time] = value.split(",")
        if(comedian && time){
            data.booking.push({comedian, time})
            times.add(time);
           
        }
        
       }else{
        data[field] = value;
    }
    if(times.size !== data.booking.length){
     notification.show("The same time!", false)
    }
    })
 })
}

init()
