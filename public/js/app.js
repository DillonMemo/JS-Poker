// 페이지가 load (열릴때) 무조건 실행 
window.addEventListener('load', function () {
    console.log('1');

    initialize();
});

// user 객체 인스턴스 생성
function user(){
    this.player = new Array(7);

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
    console.log('start');
}

// 베팅 버튼 이벤트 핸들러
function betting() {
    console.log('betting');
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
    }
    for (var i = 0; i < new user().player.length; i++) {
        user1.player[i] = document.createElement('img'); // player1 카드의 이미지 객체 생성
        user2.player[i] = document.createElement('img');
        user3.player[i] = document.createElement('img');
        user4.player[i] = document.createElement('img');
    }

    for (var i = 0; i < 10; i++){
        card[i] = document.createElement('img'); // 이미지 객체 생성
        card[i].src = '../public/images/S' + (i + 2 ) + '.png'; // 전체 카드 배열 0 ~ 9까지 S 카드를 저장
        card[i + 10] = document.createElement('img');
        card[i + 10].src = '../public/images/D' + (i + 2 ) + '.png'; // 전체 카드 배열 10 ~ 19까지 D 카드를 저장
        card[i + 20] = document.createElement('img');
        card[i + 20].src = '../public/images/H' + (i + 2 ) + '.png'; // 전체 카드 배열 20 ~ 29 H 카드를 저장
        card[i + 30] = document.createElement('img');
        card[i + 30].src = '../public/images/C' + (i + 2 ) + '.png'; // 전체 카드 배열 30 ~ 39 C 카드를 저장
    }
}

function disable(){
    document.getElementById("m_bet").disabled = true;
    document.getElementById("m_die").disabled = true;
    document.getElementById("m_nextgame").disabled = true;
    document.getElementById("m_exit").disabled = true;
}

function enable() {  // '다음 게임'빼고 전체 활성화
    document.getElementById("m_gamestart").disabled = false;
    document.getElementById("m_bet").disabled = false;
    document.getElementById("m_die").disabled = false;
    document.getElementById("m_exit").disabled = false;
}