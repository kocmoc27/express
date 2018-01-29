var timeTable = []; 
var dateReserv = "";
var Days = ['в Понедельник','во Вторник','в Среду','в Четверг','в Пятницу'],
    Time = ['9-00','12-00','15-00','18-00'];
// Получение всех пользователей
function GetReservations() {
    $.ajax({
        url: "/reservations",
        type: "GET",
        contentType: "application/json",
        success: function (reservations) {
            var rows = "";
            timeTable = reservations;
            reservations.forEach(function (reservation) {
                // добавляем полученные элементы в таблицу
                rows += row(reservation);
            })
            $(".table tbody").append(rows);
            ViewTimeTable(timeTable);
        }
    });
}

function GetReservation(id) {
    $.ajax({
        url: "/reservations/"+id,
        type: "GET",
        contentType: "application/json",
        success: function (reservation) {
            var form = document.forms["writeForm"];
            form.elements["id"].value = reservation._id;
            form.elements["date"].value = reservation.date;
            form.elements["name"].value = reservation.name;
            form.elements["phone"].value = reservation.phone;
        }
    });
}

// Запись на сеанс
function CreateReservation(date, name, phone) {
    $.ajax({
        url: "/reservations",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            date: date,
            name: name,
            phone: phone
        }),
        success: function(reserv) {
            reset();
            $(".table tbody").append(row(reserv));
            var btn = document.getElementById(reserv.date);
            Reserved(btn);

            alert( "Вы записались на сеанс " + Days[reserv.date.charAt(0)] +" в "+ Time[reserv.date.charAt(1)-1] + " часов");
        }
    })
}

// Изменение пользователя
function EditReservation(Id, Date, Name, Phone) {
    $.ajax({
        url: "/reservations",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: Id,
            date: Date,
            name: Name,
            phone: Phone
        }),
        success: function (res) {
            reset();
            console.log(res);
            $("tr[data-rowid='" + res._id + "']").replaceWith(row(res));
        }
    })
}

function DeleteReservation(id) {
    $.ajax({
        url: "/reservations/"+id,
        contentType: "application/json",
        method: "DELETE",
        success: function(res) {
            $("tr[data-rowid='"+ res._id +"']").remove();
        }
    })
}

// создание строки для таблицы
var row = function (reserv) {
    return `<tr data-rowid='${reserv._id}'><td> ${reserv._id} </td>
                <td> ${reserv.date} </td>
                <td> ${reserv.name} </td> <td> ${reserv.phone} </td>
                <td><a class='editLink' data-id='${reserv._id}'>Изменить</a> |
                <a class='removeLink' data-id='${reserv._id}'>Удалить</a></td></tr>`;
}

// сброс формы
function reset() {
    var form = document.forms["writeForm"];
    form.reset();
    form.elements["id"].value = 0;
}

//сброс значений формы:
$("#reset").click(function (e){
    e.preventDefault();
    reset();
})

//отправить на сервер запись на прием
$('form[name="writeForm"]').submit(function(e){
    e.preventDefault();
    var id = this.elements["id"].value;
    var date = this.elements["date"].value;
    var name = this.elements["name"].value;
    var phone = this.elements["phone"].value;
    if(id == 0)
        CreateReservation(date,name,phone);
    else
        EditReservation(id, date, name, phone);
})

// нажимаем на ссылку Изменить
$("body").on("click", ".editLink", function () {
    var id = $(this).data("id");
    GetReservation(id);
})

// нажимаем на ссылку Удалить
$("body").on("click", ".removeLink", function () {
    var id = $(this).data("id");
    DeleteReservation(id);
})

function ViewTimeTable(table) {    
    var btns = $("#shedule button");
    
    for(var i = 0; i < btns.length; i++ ) {
        btns[i].setAttribute('class','vacant');
        btns[i].textContent = 'Забронировать';
    }
    
    for(var j = 0; j < table.length; j++) {     
        var id = table[j].date;
        var btn = document.getElementById(id);
        Reserved(btn);
    }
}

function Reserved(element) {  
    element.setAttribute('class', 'reserved');
    element.setAttribute("disabled", "disabled");
    element.textContent = "Забронировано"; 
}

$("#shedule").on("click","button",function(e) {
    var form = document.forms['writeForm'];
    // тут форма становится видимой
    form.elements['date'].value = e.target.id;
})

GetReservations();



