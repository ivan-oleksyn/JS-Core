/* Variables */
let timetoRun = 59000;
let timer = $('.timer');
let modalTimer = $('.modal-timer');
let countTimeId, countSeconds, countMinutes;
let dragElemArr = $('.drag-elem');
let checkArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
let isGameStarted = false;

/* Functions */
const countTime = () => {
    if (!isGameStarted && $('.dropped').length === 0) {
        isGameStarted = true

        countTimeId = setInterval(function () {
            countSeconds = parseInt((timetoRun / 1000) % 60);
            countMinutes = parseInt((timetoRun / (1000 * 60)) % 60);
            timer.html(`0${countMinutes}:${countSeconds}`);
            modalTimer.html(`0${countMinutes}:${countSeconds}`);
            if (countSeconds < 10) {
                timer.html(`0${countMinutes}:0${countSeconds}`);
                modalTimer.html(`0${countMinutes}:0${countSeconds}`);
            }
            timetoRun -= 1000;
            if (countSeconds <= 0) {
                endGame();
            }
        }, 1000);
    }
}

const shuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}

const checkResult = () => {
    let check = true;
    refreshGameData();
    if ($('.dropped').length !== checkArr.length) {
        showFailMessage();
        return;
    }

    for (let i = 0; i < $('.dropped').length; i++) {
        if ($('.dropped').eq(i).data('order') != checkArr[i]) {
            check = false;
            break;
        }
    }
    if (check) {
        showSucessMessage();
    } else {
        showFailMessage();
    }
}

const showSucessMessage = () => {
    $('.modal-result-title').html('Woohoo, well done, you did it!');
    $('.modal-window-check').addClass('hidden');
    $('.modal-window-result').removeClass('hidden');
}

const showFailMessage = () => {
    $('.modal-result-title').html("It's a pity, but you lost");
    $('.modal-window-check').addClass('hidden');
    $('.modal-window-result').removeClass('hidden');
}

const endGame = () => {
    clearInterval(countTimeId);
    enableStartkButton();
    disableCheckButton();
    $('.modal-window').removeClass('hidden');
    $('.modal-window-result').removeClass('hidden');
    $('.timer').html('01:00');
    $('.modal-timer').html('01:00');
    $('.modal-result-title').html("It's a pity, but you lost");
    refreshGameData();
}

const refreshGameData = () => {
    isGameStarted = false;
    timetoRun = 59000;
    disableStartButton();
    disableCheckButton();
}

const enableCheckButton = () => {
    $('.check').removeAttr('disabled', 'disabled');
    $('.check').removeClass('disabled');
}

const disableCheckButton = () => {
    $('.check').attr('disabled', 'disabled');
    $('.check').addClass('disabled');
}
const enableStartkButton = () => {
    $('.start').removeAttr('disabled');
    $('.start').removeClass('disabled');
}
const disableStartButton = () => {
    $('.start').attr('disabled', 'disabled');
    $('.start').addClass('disabled');
}

$(document).ready(function () {
    shuffle(dragElemArr);
    $('.drag-field').append(dragElemArr);

    $('.start').on('click', function () {
        $(this).data('clicked', true);
        countTime();
        disableStartButton();
        if (isGameStarted) {
            enableCheckButton();
        }
    });

    $('.check').on('click', function () {
        $('.modal-window').removeClass('hidden');
        $('.modal-window-check').removeClass('hidden');
    });

    $('.new').on('click', function () {
        for (let i = 0; i < $('.drag-elem').length; i++) {
            if ($('.drag-elem').eq(i).hasClass('dropped')) {
                $('.drag-elem').eq(i).removeClass('dropped').css('position', 'relative');
            }
        }
        for (let j = 0; j < $('.drop-elem').length; j++) {
            if ($('.drop-elem').eq(j).hasClass('img-in')) {
                $('.drop-elem').eq(j).removeClass('img-in');
            }
        }
        clearInterval(countTimeId);
        shuffle(dragElemArr);
        $('.drag-field').append(dragElemArr);
        $('.drag-elem').css('possition', 'relative');
        $('.start').data('clicked', false);
        enableStartkButton();
        disableCheckButton();
    });

    $('.modal-btn-close').on('click', function () {
        $('.modal-window').addClass('hidden');
    });

    $('.modal-btn-check').on('click', function () {
        $('.modal-window-check').addClass('hidden');
        $('.modal-window-result').removeClass('hidden');
        disableCheckButton();
        clearInterval(countTimeId);
        $('.timer').html('01:00');
        $('.modal-timer').html('01:00');
        checkResult();
    });

    $('.result-btn-close').on('click', function () {
        $('.modal-window').addClass('hidden');
        $('.modal-window-result').addClass('hidden');
    });

    $('.drag-elem').draggable({
        revert: 'invalid',
        start: function () {
            if ($('.start').data('clicked') == false) {
                countTime();
                disableStartButton();
                if (isGameStarted) {
                    enableCheckButton();
                }
            }
            if ($(this).hasClass('dropped')) {
                $(this).removeClass('dropped');
                $(this).parent().removeClass('img-in')
            }
        }
    });

    $('.drop-elem').droppable({
        accept: function () {
            return !$(this).hasClass('img-in')
        },
        drop: function (event, ui) {
            let draggableElem = ui.draggable;
            let droppedOn = $(this);
            droppedOn.addClass('img-in');
            $(draggableElem).addClass('dropped').css({
                position: 'absolute',
                top: 0,
                left: 0,
            }).appendTo(droppedOn);
        }
    });

});