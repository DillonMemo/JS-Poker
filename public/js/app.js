// 페이지가 load (열릴때) 무조건 실행 
window.addEventListener('load', function () {
    console.log('1');

    initialize();
});

// user 객체 인스턴스 생성
function user(){
    this.select = new Array(7);

    this._suit = new Array(7);

    this._rank = new Array(7);

    this._money = { value : 990 };

    this._flag = 0;

    this._index = [];
}

var card = new Array(40);

// user 생성 선언
var user1 = new user();
var user2 = new user();
var user3 = new user();
var user4 = new user();

// 전체 결과를 담는 2차원 배열로써 행은 유저번호 열은 포카드 ~ 노페어 값은 숫자
var result = new Array(4); 
for(var i = 0; i < result.length; i++)
    result[i] = new Array(6); // 포카드 ~ 노페어까지 열을 만듬

// 이미지 객체 배열 //
var back = new Array(9); // 유저 2 ~ 4의 뒷면 이미지는 담는 배열
var die = new Array(6); // 유저 2 ~ 4의 다이 이미지를 담는 배열
var user_face = new Array(4); // 유저의 캐릭터 이미지 배열

var game_flag = 0; // 게임이 시작중인지 확인하는 플래그
var restart_flag = 0; // 게임이 재시작했는지 확인하는 플래그
var num = 0; // 라운드 번호
var back_num = 0; // 뒷면 이미지의 번호를 지정하는 변수
var Betting_Account = 40;  // 총 베팅금
var betting = Betting_Account/2;    // 한 턴 베팅금
var bettingsum =0;  // 4명 유저의 베팅금
var alldie_money = 0; // 유저3명 다이시 저장되는 베팅금
var max = 0; // 최고 숫자 카드
var find = 0; // 짝을 맞췄을 경우 하위 등급 검색여부 판단
var cowinner = 0; // 투페어, 원페어 공동우승자
var winner = 0; // 우승자
var winner_money = 0; // 우승자의 상금
var cowinner_money = 0; // 공동 우승자의 상금


// 게임시작 버튼 이벤트 핸들러
function start() {
    initialize(); // 초기화 함수
    enable();
    game_flag++;

    // 최초 금액 표시
    document.getElementById('Computer-1-money').innerHTML = Math.floor(user1._money.value)+ '원';
    document.getElementById('Computer-2-money').innerHTML = Math.floor(user2._money.value)+ '원';
    document.getElementById('Computer-3-money').innerHTML = Math.floor(user3._money.value)+ '원';
    document.getElementById('User-money').innerHTML = Math.floor(user4._money.value)+ '원';
    document.getElementById('c_board_top').innerHTML = '<베팅금><br/>' + betting + '원';
    document.getElementById('c_board_bottom').innerHTML = '<총 베팅금><br>'+Betting_Account+'원';

    while(num < 3){
        card_distribution(user1, user1._suit, user1._rank)  // 유저1 1~3번쨰 카드 분배
        card_distribution(user2, user2._suit, user2._rank)  // 유저2 1~3번쨰 카드 분배
        card_distribution(user3, user3._suit, user3._rank)  // 유저3 1~3번쨰 카드 분배
        card_distribution(user4, user4._suit, user4._rank)  // 유저4 1~3번쨰 카드 분배
        num++;
    }

    // 베팅 후 카드 분배 동안 베팅, 다이 비활성화
    betting_disable();

    // 1번재 카드 분배(뒷면)
    setTimeout(function(){document.getElementById('User-card').appendChild(user1.select[0]);}, 300);
    setTimeout(function(){document.getElementById('Computer-1-card').appendChild(back[0]);}, 500);
    setTimeout(function(){document.getElementById('Computer-2-card').appendChild(back[1]);}, 700);
    setTimeout(function(){document.getElementById('Computer-3-card').appendChild(back[2]);}, 900);
  // 2번쨰 카드 분배(뒷면)
    setTimeout(function(){document.getElementById('User-card').appendChild(user1.select[1]);}, 1100);
    setTimeout(function(){document.getElementById('Computer-1-card').appendChild(back[3]);}, 1300);
    setTimeout(function(){document.getElementById('Computer-2-card').appendChild(back[4]);}, 1500);
    setTimeout(function(){document.getElementById('Computer-3-card').appendChild(back[5]);}, 1700);
  // 3번쨰 카드 분배
    setTimeout(function(){document.getElementById('User-card').appendChild(user1.select[2]);}, 1900);
    setTimeout(function(){document.getElementById('Computer-1-card').appendChild(user2.select[2]);}, 2100);
    setTimeout(function(){document.getElementById('Computer-2-card').appendChild(user3.select[2]);}, 2300);
    setTimeout(function(){document.getElementById('Computer-3-card').appendChild(user4.select[2]);}, 2500);
    setTimeout(function(){enable()}, 2500);
}

// 베팅 버튼 이벤트 핸들러
function betting() {
    bettingsum = 0;

    // // 게임 시작 확인
    // if (game_flag == 0) {
    //     alert('게임이 시작되지 않았습니다.');
    //     return 0;
    // }
    if(user2._flag < 0.9) user2._flag = Math.random(); // 유저 플래그가 0.9이하면 다시 랜덤함수로 다이할지 저장
    if(user3._flag < 0.9) user3._flag = Math.random();
    if(user4._flag < 0.9) user4._flag = Math.random();

    if(num < 7){
        //유저 3명 모두 '다이' 게임 종료
        if(user2._flag > 0.9 && user3._flag > 0.9 && user4._flag > 0.9){

            setTimeout(function(){
                user1_money.value += alldie_money;
            // 카드 지우기
            document.getElementById('Computer-1-card').innerHTML = '';
            document.getElementById('Computer-2-card').innerHTML = '';
            document.getElementById('Computer-3-card').innerHTML = '';
            document.getElementById('User-card').innerHTML = '';

            // 유저 3명 모두 다이했을때 출력
            document.getElementById('computer-1-result').innerHTML = '아귀 -> Die'
            document.getElementById('computer-2-result').innerHTML = '정마담 -> Die'
            document.getElementById('computer-3-result').innerHTML = '고광렬 -> Die'
            document.getElementById('User-result').innerHTML = '고니 -> Winner' + '<br>+'+Math.floor(alldie_money)+ '만원';
            document.getElementById('result').innerHTML = '고니승!!';
            document.getElementById('c_board_top').innerHTML = '';
            document.getElementById('c_board_bottom').innerHTML = '';

            document.getElementById('User-money').innerHTML = Math.floor(user1_money.value)+ '만원';

            next_enable()
            die_disable()
            }, 1000);
        }

        card_distribution(user1, user1._suit, user1._rank);     // 유저1 4~7번쨰 카드 분배

        if(user2._flag < 0.9)
              card_distribution(user2, user2._suit, user2._rank)  // 유저2 4~7번쨰 카드 분배
        else {
            setTimeout(function(){
            document.getElementById('Computer-1-card').innerHTML='';  // 카드 초기화
            document.getElementById('Computer-1-picture').innerHTML='';  // 유저 사진 초기화
            document.getElementById('Computer-1-card').appendChild(die[0]);  // 카드 대신 해골
            document.getElementById('Computer-1-picture').appendChild(die[1]);  // 유저 사진 해골
            }, 500);
        }

        if(user3._flag < 0.9)
              card_distribution(user3, user3._suit, user3._rank)  // 유저3 4~7번쨰 카드 분배
        else {
            setTimeout(function(){
            document.getElementById('Computer-2-card').innerHTML='';
            document.getElementById('Computer-2-picture').innerHTML='';
            document.getElementById('Computer-2-card').appendChild(die[2]);
            document.getElementById('Computer-2-picutre').appendChild(die[3]);
            }, 700);
        }

        if(user4._flag < 0.9)
              card_distribution(user4, user4._suit, user4._rank)  // 유저4 4~7번쨰 카드 분배

        else {
            setTimeout(function(){
            document.getElementById('Computer-3-card').innerHTML='';
            document.getElementById('Computer-3-picture').innerHTML='';
            document.getElementById('Computer-3-card').appendChild(die[4]);
            document.getElementById('Computer-3-picture').appendChild(die[5]);
            }, 900);
        }

        // 4,5,6번째 카드 받기
        if (num <= 5) {
            betting_disable() // 베팅 후 카드 분배 동안 베팅, 다이 비활성화
            betting_calculate('User-card', 'User-money', user, user1._money, 300, num); // 베팅 금액 계산 함수 실행

            if(user2_flag < 0.9) { // 유저가 다이상태가 아니면
            betting_calculate('Computer-1-card', 'Computer-1-money', user2, user2._money, 500, num);
            }

            if(user3_flag < 0.9) {
            betting_calculate('Computer-2-card', 'Computer-2-money', user3, user3._money, 700, num);
            }

            if(user4_flag < 0.9) {
            betting_calculate('Computer-3-card', 'Computer-3-money', user4, user4._money, 900, num);
            }

            Betting_Account += bettingsum;
            alldie_money = Betting_Account;
            betting = Betting_Account/2;
            setTimeout(function(){
                document.getElementById('c_board_top').innerHTML = '<베팅금><br>'+betting+'원';
                document.getElementById('c_board_bottom').innerHTML = '<총 베팅금><br>'+Math.floor(Betting_Account)+'원';}, 900);
            setTimeout(function(){enable()}, 900);
        }
    }
}

// 다이 버튼 이벤트 핸들러
function die() {
    console.log('die');
}

// 다음게임 이벤트 핸들러
function nextgame() {
    console.log('nextgame');
}

// 게임종료 이벤트 핸들러
function exit() {
    console.log('exit');
}

function initialize(){
    disable();
    card_id = new Array(52); // 카드 배열 초기화

    user1 = new user();
    user2 = new user();
    user3 = new user();
    user4 = new user();

    result = new Array(4);
    for(var i = 0; i < 4; i++){
        result[i] = new Array(6);
    }
        

    rank = 2;
    game_flag = 0;
    num = 0;
    back_num = 0;
    user2._flag = 0;
    user3._flag = 0;
    user4._flag = 0;
    max = 0; // 최고 숫자 카드
    find = 0; // 짝을 맞췄을 경우 하위 등급 검색여부 판단
    cowinner = 0; // 투페어, 원페어 공동우승자
    winner = 0; // 우승자
    winner_money = 0;
    cowinner_money = 0;

    if(restart_flag == 0){
        user1._money.value = 990;
        user2._money.value = 990;
        user3._money.value = 990;
        user4._money.value = 990;
    }

    restart_flag = 0;
    Betting_Account = 40;  // 총 베팅금
    betting = Betting_Account/2;    // 한 턴 베팅금
    bettingsum =0;  // 4명 유저의 베팅금
    
    // 카드 초기화
    document.getElementById('Computer-1-card').innerHTML = '';
    document.getElementById('Computer-2-card').innerHTML = '';
    document.getElementById('Computer-3-card').innerHTML = '';
    document.getElementById('User-card').innerHTML = '';

    // 금액 초기화
    document.getElementById('Computer-1-money').innerHTML = '';
    document.getElementById('Computer-2-money').innerHTML = '';
    document.getElementById('Computer-3-money').innerHTML = '';
    document.getElementById('User-money').innerHTML = '';
    document.getElementById('c_board_top').innerHTML = '';
    document.getElementById('c_board_bottom').innerHTML = '';
    
    // 베팅 결과 초기화
    document.getElementById('computer-1-result').innerHTML = '';
    document.getElementById('computer-2-result').innerHTML = '';
    document.getElementById('computer-3-result').innerHTML = '';
    document.getElementById('User-result').innerHTML = '';
    document.getElementById('result').innerHTML = '';

    for (var i = 0; i < die.length; i++) {
        die[i] = document.createElement('img');
        die[i].src = '../public/images/die.png' ;
        die[i].id = i;  // 유저의 다이 배열 초기화
    }
    for (var i = 0; i < back.length; i++) {
        back[i] = document.createElement('img');
        back[i].src = '../public/images/back.png'; // 유저의 뒷면 배열 초기화
        back[i].style.width = '13%';
    }
    for (var i = 0; i < new user().select.length; i++) {
        user1.select[i] = document.createElement('img'); // player1 카드의 이미지 객체 생성
        user2.select[i] = document.createElement('img');
        user3.select[i] = document.createElement('img');
        user4.select[i] = document.createElement('img');
    }

    for (var i = 0; i < 10; i++){
        card[i] = document.createElement('img'); // 이미지 객체 생성
        card[i].src = '../public/images/S' + (i + 2 ) + '.png'; // 전체 카드 배열 0 ~ 9까지 S 카드를 저장
        card[i].style.width = '13%';
        card[i + 10] = document.createElement('img');
        card[i + 10].src = '../public/images/D' + (i + 2 ) + '.png'; // 전체 카드 배열 10 ~ 19까지 D 카드를 저장
        card[i + 10].style.width = '13%';
        card[i + 20] = document.createElement('img');
        card[i + 20].src = '../public/images/H' + (i + 2 ) + '.png'; // 전체 카드 배열 20 ~ 29 H 카드를 저장
        card[i + 20].style.width = '13%';
        card[i + 30] = document.createElement('img');
        card[i + 30].src = '../public/images/C' + (i + 2 ) + '.png'; // 전체 카드 배열 30 ~ 39 C 카드를 저장
        card[i + 30].style.width = '13%';
    }
}

function disable(){
    document.getElementById("m_bet").disabled = true;
    document.getElementById("m_die").disabled = true;
    document.getElementById("m_nextgame").disabled = true;
    document.getElementById("m_exit").disabled = true;
}

// '베팅'시 전체 비활성화 -> 카드 분배 꼬임
function betting_disable() {  
    document.getElementById("m_start").disabled = true;
    document.getElementById("m_bet").disabled = true;
    document.getElementById("m_die").disabled = true;
    document.getElementById("m_nextgame").disabled = true;
    document.getElementById("m_exit").disabled = true;
}

function die_disable() {  // '다이'시 '베팅','다이' 비활성화
    document.getElementById("m_bet").disabled = true;
    document.getElementById("m_die").disabled = true;
}

function enable() {  // '다음 게임'빼고 전체 활성화
    document.getElementById("m_start").disabled = false;
    document.getElementById("m_bet").disabled = false;
    document.getElementById("m_die").disabled = false;
    document.getElementById("m_exit").disabled = false;
}

function next_enable() { // '다음 게임' 활성화
    document.getElementById("m_nextgame").disabled = false;
}

// 카드 랜덤 분배 이벤트 핸들러
function card_distribution(user_arr, suit_arr, rank_arr){
    do n = Math.floor(Math.random() * 40); // 0~51값 랜덤 생성
    while (card[n].id == 'X')

    user_arr.select[num] = card[n];
    suit_arr[num] = Math.floor(n / 10);
    rank_arr[num] = n % 10 + 2;
    card[n].id = 'X'; 
}

/* 베팅 금액 계산 함수 */
function betting_calculate(Player_Card, Player_Money, User_Arr, User_Money, Timer, index) // 플레이어 카드 div, 금액 div, 카드배열, 타이머, 라운드 번호
{
    setTimeout(function(){document.getElementById(Player_Card).appendChild(User_Arr[index]);}, Timer); // 유저 카드 배열에서 현재 라운드의 카드를 출력
    bettingsum += betting; // 해당 라운드의 베팅금의 합
    User_Money.value -= betting; // 유저의 금액에서 베팅금을 뺌
    setTimeout(function(){document.getElementById(Player_Money).innerHTML =  Math.floor(User_Money.value) + '원';}, Timer); // 베팅금을 뺀 유저의 금액 표
}

