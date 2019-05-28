// 페이지가 load (열릴때) 무조건 실행 
window.addEventListener('load', function () {
    console.log('1');

    initialize();
});

// user 객체 인스턴스 생성
function user(_money){
    this.select = new Array(7);

    this._suit = new Array(7);

    this._rank = new Array(7);

    if(_money === undefined){
        this._money = { value : 990 };
    }else{
        this._money = _money;
    }
    

    this._flag = 0;

    this._index = [];
}

var game_flag = 0; // 게임이 시작중인지 확인하는 플래그
var restart_flag = 0; // 게임이 재시작했는지 확인하는 플래그

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
var num = 0; // 라운드 번호
var back_num = 0; // 뒷면 이미지의 번호를 지정하는 변수
var Betting_Account = 40;  // 총 베팅금
var betting = Math.floor(Betting_Account/2);    // 한 턴 베팅금
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
    document.getElementById('User-money').innerHTML = Math.floor(user1._money.value)+ '원';
    document.getElementById('Computer-1-money').innerHTML = Math.floor(user2._money.value)+ '원';
    document.getElementById('Computer-2-money').innerHTML = Math.floor(user3._money.value)+ '원';
    document.getElementById('Computer-3-money').innerHTML = Math.floor(user4._money.value)+ '원';
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
function bettingEvent() {
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
            document.getElementById('User-result').innerHTML = '고니 -> Winner' + '<br>+'+Math.floor(alldie_money)+ '원';
            document.getElementById('result').innerHTML = '고니승!!';
            document.getElementById('c_board_top').innerHTML = '';
            document.getElementById('c_board_bottom').innerHTML = '';

            document.getElementById('User-money').innerHTML = Math.floor(user1_money.value)+ '원';

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
            
            die[0].width = 200;
            document.getElementById('Computer-1-card').appendChild(die[0]);  // 카드 대신 해골

            document.getElementById('Computer-1-picture').style.backgroundImage = 'url(../public/images/die.png)';
            }, 500);
        }

        if(user3._flag < 0.9)
              card_distribution(user3, user3._suit, user3._rank)  // 유저3 4~7번쨰 카드 분배
        else {
            setTimeout(function(){
            document.getElementById('Computer-2-card').innerHTML='';
            document.getElementById('Computer-2-picture').innerHTML='';
            
            die[2].width = 200;
            document.getElementById('Computer-2-card').appendChild(die[2]);

            document.getElementById('Computer-2-picture').style.backgroundImage = 'url(../public/images/die.png)';
            }, 700);
        }

        if(user4._flag < 0.9)
              card_distribution(user4, user4._suit, user4._rank)  // 유저4 4~7번쨰 카드 분배

        else {
            setTimeout(function(){
            document.getElementById('Computer-3-card').innerHTML='';
            document.getElementById('Computer-3-picture').innerHTML='';

            
            die[4].width = 200;
            document.getElementById('Computer-3-card').appendChild(die[4]);

            document.getElementById('Computer-3-picture').style.backgroundImage = 'url(../public/images/die.png)';
            }, 900);
        }

        // 4,5,6번째 카드 받기
        if (num <= 5) {
            betting_disable() // 베팅 후 카드 분배 동안 베팅, 다이 비활성화
            betting_calculate('User-card', 'User-money', user1, user1._money, 300, num); // 베팅 금액 계산 함수 실행

            if(user2._flag < 0.9) { // 유저가 다이상태가 아니면
            betting_calculate('Computer-1-card', 'Computer-1-money', user2, user2._money, 500, num);
            }

            if(user3._flag < 0.9) {
            betting_calculate('Computer-2-card', 'Computer-2-money', user3, user3._money, 700, num);
            }

            if(user4._flag < 0.9) {
            betting_calculate('Computer-3-card', 'Computer-3-money', user4, user4._money, 900, num);
            }

            Betting_Account += bettingsum;
            alldie_money = Betting_Account;
            betting = Math.floor(Betting_Account/2);
            setTimeout(function(){
                document.getElementById('c_board_top').innerHTML = '<베팅금><br>'+betting+'원';
                document.getElementById('c_board_bottom').innerHTML = '<총 베팅금><br>'+Math.floor(Betting_Account)+'원';}, 900);
            setTimeout(function(){enable()}, 900);
        }

        else if (num == 6){
            die_disable() // 베팅 후 카드 분배 동안 베팅, 다이 비활성화
            betting_calculate('User-card', 'User-money', user1, user1._money, 300, num);

            if(user2._flag < 0.9) {
            betting_calculate('Computer-1-card', 'Computer-1-money', back, user2._money, 500, 6);
            }

            if(user3._flag < 0.9) {
            betting_calculate('Computer-2-card', 'Computer-2-money', back, user3._money, 700, 7);
            }

            if(user4._flag < 0.9) {
            betting_calculate('Computer-3-card', 'Computer-3-money', back, user4._money, 900, 8);
            }
            Betting_Account += bettingsum;
            alldie_money = Betting_Account;
            betting = Betting_Account/2;

            setTimeout(function(){document.getElementById('c_board_top').innerHTML = '<베팅금><br>'+Math.floor(betting)+'원';}, 900);
            setTimeout(function(){document.getElementById('c_board_bottom').innerHTML = '<총 베팅금><br>'+Math.floor(Betting_Account)+'원';}, 900);

            setTimeout(function(){enable()}, 900);
            console.log('betting account : ' + Betting_Account)
            console.log('betting : ' + betting)
            console.log('bettingsum '  + bettingsum)
        }
        num++;
    }else if (num == 7){
        document.getElementById('User-card').innerHTML = '';
        document.getElementById('Computer-1-card').innerHTML = '';
        document.getElementById('Computer-2-card').innerHTML = '';
        document.getElementById('Computer-3-card').innerHTML = '';

        console.log('betting account : ' + Betting_Account);
        console.log('betting : ' + betting);
        console.log('bettingsum ' + bettingsum);

        user1._money.value -= betting;
        user2._money.value -= betting;
        user3._money.value -= betting;
        user4._money.value -= betting;
        Betting_Account += (betting * 4);

        document.getElementById('c_board_top').innerHTML = ' ';
        document.getElementById('c_board_bottom').innerHTML = ' ';
        document.getElementById('User-money').innerHTML = Math.floor(user1._money.value) + '원';
        document.getElementById('Computer-1-money').innerHTML = Math.floor(user2._money.value) + '원';
        document.getElementById('Computer-2-money').innerHTML = Math.floor(user3._money.value) + '원';
        document.getElementById('Computer-3-money').innerHTML = Math.floor(user4._money.value) + '원';
        setTimeout(function () { document.getElementById('c_board_top').innerHTML = '상금 : ' + Math.floor(Betting_Account) + '원'; }, 0);

        // 받은 모든 카드 오픈
        for (var i = 0; i < num; i++) { // 7까지 반복 실행
            document.getElementById('User-card').appendChild(user1.select[i]);
            if (user2._flag < 0.9) document.getElementById('Computer-1-card').appendChild(user2.select[i]);
            else document.getElementById('Computer-1-card').appendChild(die[0]);

            if (user3._flag < 0.9) document.getElementById('Computer-2-card').appendChild(user3.select[i]);
            else document.getElementById('Computer-2-card').appendChild(die[2]);

            if (user4._flag < 0.9) document.getElementById('Computer-3-card').appendChild(user4.select[i]);
            else document.getElementById('Computer-3-card').appendChild(die[4]);
        }

        setTimeout(function () { enable() }, 0);
        setTimeout(function () { next_enable() }, 0);
        setTimeout(function () { die_disable() }, 0);

        result_save('User-result', '고니', 0, user1._rank, user1._index, 0); // 유저의 결과를 2차원 배열에 저장
        result_save('computer-1-result', '아귀', 1, user2._rank, user2._index, user2._flag);
        result_save('computer-2-result', '정마담', 2, user3._rank, user3._index, user3._flag);
        result_save('computer-3-result', '고광렬', 3, user4._rank, user4._index, user4._flag);

        // 우승자 및 투페어(원페어)시 공동우승자를 찾는 알고리즘
        for(var j = 0; j < 7; j++) // 7번째 열 노페어까지
        {
          if(find == 0) // 우승자를 찾았으면 그열에서 멈춤
          {
            for(i = 0; i < 4; i ++) // 유저 1 ~ 4까지
            {
              if(max <= result[i][j]) // 현재 최고값보다 2차원 배열의 값이 크다면
              {
                if((find == 1) && (max == result[i][j])) // 우승자를 찾았는데, 최대값과 같은 숫자가 있다면
                {
                  cowinner = (i + 1); // 공동우승자 번호 저장
                  console.log('cowinner : ' + cowinner)
                  break; // 그 열의 반복문을 빠져나옴
                }

                max = result[i][j]; // 2차원 배열의 최대 숫자를 최대값으로 지정
                winner = (i + 1); // 우승자 번호 저장
                find = 1; // 우승자를 찾았다는 플래그
                console.log('winner : ' + winner);
                console.log('max : ' + result[i][j]);
              }
            }
          }
        }

        money_to_winner(winner, cowinner); // 우승자와 공동우승자에게 상금 지급
        document.getElementById('User-money').innerHTML = Math.floor(user1._money.value) + '원';
        document.getElementById('Computer-1-money').innerHTML = Math.floor(user2._money.value) + '원';
        document.getElementById('Computer-2-money').innerHTML = Math.floor(user3._money.value) + '원';
        document.getElementById('Computer-3-money').innerHTML = Math.floor(user4._money.value) + '원';
        // 누가 이겼는지 출력하기 위해 우3자를 이름으로 지정
        if (winner == 1) winner = '고니'
        if (winner == 2) winner = '아귀';
        if (winner == 3) winner = '정마담';
        if (winner == 4) winner = '고광렬';
        if (cowinner == 1) cowinner = '고니';
        if (cowinner == 2) cowinner = '아귀';
        if (cowinner == 3) cowinner = '정마담';
        if (cowinner == 4) cowinner = '고광렬';

        if (cowinner == 0) document.getElementById('result').innerHTML = winner + ' 우승'; // 공동우승자가 없을시
        else document.getElementById('result').innerHTML = winner + ' ' + cowinner + ' 무승부'; // 공동우승자가 있을시 무승부

        num++;
    }
}

// 다이 버튼 이벤트 핸들러
function dieEvent() {
    die_disable()  // 다이 선택시 베팅,다이 버튼 비활성화
    next_enable()  // 다이 선택시 다음 게임 활성화
    // 다이할시 총 베팅금액의 33%를 나눠줌
    user2._money.value += Betting_Account / 3;
    user3._money.value += Betting_Account / 3;
    user4._money.value += Betting_Account / 3;

    // 다이 내용 출력
    document.getElementById('User-result').innerHTML = 'ME : Die 하셨습니다.';
    document.getElementById('computer-1-result').innerHTML = '아귀 +' + Math.floor(Betting_Account / 3) + '원';
    document.getElementById('computer-2-result').innerHTML = '정마담 +' + Math.floor(Betting_Account / 3) + '원';
    document.getElementById('computer-3-result').innerHTML = '고광렬 +' + Math.floor(Betting_Account / 3) + '원';
    // 플레이어 잔액
    document.getElementById('Computer-1-money').innerHTML = Math.floor(user2._money.value) + '원';
    document.getElementById('Computer-2-money').innerHTML = Math.floor(user3._money.value) + '원';
    document.getElementById('Computer-3-money').innerHTML = Math.floor(user4._money.value) + '원';
    document.getElementById('c_board_top').innerHTML = '';
    document.getElementById('c_board_bottom').innerHTML = '';
    // 카드 지우기
    document.getElementById('User-card').innerHTML = '';
    document.getElementById('Computer-1-card').innerHTML = '';
    document.getElementById('Computer-2-card').innerHTML = '';
    document.getElementById('Computer-3-card').innerHTML = '';
    // 해골 이미지 되돌리기
    // document.getElementById('User-picture').innerHTML = '';
    // document.getElementById('Computer-1-picture').innerHTML = '';
    // document.getElementById('Computer-2-picture').innerHTML = '';
    // document.getElementById('Computer-3-picture').innerHTML = '';
    // document.getElementById('User-picture').appendChild(user_face[0]);
    // document.getElementById('Computer-1-picture').appendChild(user_face[1]);
    // document.getElementById('Computer-2-picture').appendChild(user_face[2]);
    // document.getElementById('Computer-3-picture').appendChild(user_face[3]);
}

// 다음게임 이벤트 핸들러
function nextgame() {
    restart_flag = 1; // 재시작 플래그 1로 설정
    start(); // 시작 함수 실행
}

function initialize(){
    disable();
    card_id = new Array(52); // 카드 배열 초기화

    // This prefix setup value
    if(restart_flag === 1){
        user1 = new user(user1._money);
        user2 = new user(user2._money);
        user3 = new user(user3._money);
        user4 = new user(user4._money);
    }else{
        user1 = new user();
        user2 = new user();
        user3 = new user();
        user4 = new user();
    }

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

    restart_flag = 0;
    Betting_Account = 40;  // 총 베팅금
    betting = Math.floor(Betting_Account/2);    // 한 턴 베팅금
    bettingsum =0;  // 4명 유저의 베팅금
    
    // 유저 이미지 초기화
    document.getElementById('Computer-1-picture').style.backgroundImage = 'url(../public/images/아귀.jpg)';
    document.getElementById('Computer-2-picture').style.backgroundImage = 'url(../public/images/정마담.jpg)';
    document.getElementById('Computer-3-picture').style.backgroundImage = 'url(../public/images/고광렬.jpg)';
    document.getElementById('User-picture').style.backgroundImage = 'url(../public/images/고니.jpg)';
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
        user1.select[i] = document.createElement('img'); // Computer-1 카드의 이미지 객체 생성
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
    if(User_Arr.select !== undefined)
    setTimeout(function () { document.getElementById(Player_Card).appendChild(User_Arr.select[index]); }, Timer); // 유저 카드 배열에서 현재 라운드의 카드를 출력
    else
    setTimeout(function () { document.getElementById(Player_Card).appendChild(User_Arr[index]); }, Timer); // 유저 카드 배열에서 현재 라운드의 카드를 출력
        
    bettingsum += betting; // 해당 라운드의 베팅금의 합
    User_Money.value -= betting; // 유저의 금액에서 베팅금을 뺌
    setTimeout(function () { document.getElementById(Player_Money).innerHTML = Math.floor(User_Money.value) + '원'; }, Timer); // 베팅금을 뺀 유저의 금액 표
}

/* 결과 저장 함수 */
function result_save(Player_Div, Player_Name, Player_Number, Player_Rank, Player_index, User_Flag) // 플레이어 카드 div, 이름, 결과배열에 넣기위한 번호, 플레이어의 카드숫자배열, 유저의 숫자 갯수를 확인 하는 배열, 다이플래그
{
    var rank = 2; // 숫자 2부터
    var HighCard = rank; // 현재의 하이카드를 2로 지정

    if (User_Flag < 0.9) // 유저가 다이하지 않았다면
    {
        while (rank < 12) // 숫자 14까지 실행
        {
            Player_Rank.forEach(function (v, i) { // 배열메소드 foreach는 배열의 요소 하나씩마다 사용자가 만든 함수를 실행하는데 매개변수 v = 값, i = 인덱스 번호를 반환함
                if (v == rank) // 유저의 숫자배열 값 v가 숫자 rank와 같다면
                    Player_index.push(i)
            }); // v == rank인 배열 인덱스 번호 를 저장 하는 배열

            if (Player_index.length == 1) // 배열 인덱스 번호가 1개라면 노페어
            {
                HighCard = rank; // 하이카드를 rank로 지정
            }

            if ((Player_index.length == 2) && (result[Player_Number][4] == undefined)) // 배열 인덱스 번호가 2개이고 이전에 원페어가 아니였을시
            {
                if (result[Player_Number][2] != undefined) // 결과를 저장하는 2차원 배열 3번째열(트리플)에 이미 숫자가 있다면 풀하우스
                {
                    result[Player_Number][1] = result[Player_Number][2]; // 결과를 저장하는 2차원 배열 2번째열(풀하우스)에 트리플 저장
                    document.getElementById(Player_Div).innerHTML = Player_Name + ': ' + result[Player_Number][4] + ' / ' + result[Player_Number][1] + ' 풀하우스'; // 유저 이름과 원페어, 트리플 숫자 출력
                    Player_index = []; // 유저의 숫자 갯수를 확인 하는 배열 초기화
                }
                else { // 결과를 저장하는 2차원 배열 3번째열(트리플)에 숫자가 없다면 원페어
                    result[Player_Number][4] = rank; // 결과를 저장하는 2차원 배열 5번째열(원페어)에 rank저장

                    document.getElementById(Player_Div).innerHTML = Player_Name + ': ' + result[Player_Number][4] + ' 원페어'; // 유저 이름과 원페어 숫자 출력
                    Player_index = []; // 유저의 숫자 갯수를 확인 하는 배열 초기화
                }
            }

            if ((Player_index.length == 2) && (result[Player_Number][4] != undefined)) // 배열 인덱스 번호가 2개이고 이전에 원페어였을시
            {
                result[Player_Number][3] = rank; // 결과를 저장하는 2차원 배열 4번째열(투페어)에 rank저장
                document.getElementById(Player_Div).innerHTML = Player_Name + ': ' + result[Player_Number][4] + ' / ' + result[Player_Number][3] + ' 투페어' // 유저 이름과 투페어 숫자 출력
            }
            if (Player_index.length == 3) // 배열 인덱스 번호가 3개일시
            {
                if (result[Player_Number][4] != undefined) // 결과를 저장하는 2차원 배열 5번째열(원페어)에 이미 숫자가 있다면 풀하우스
                {
                    result[Player_Number][1] = rank; // 결과를 저장하는 2차원 배열 2번째열(풀하우스)에 rank 저장
                    document.getElementById(Player_Div).innerHTML = Player_Name + ': ' + result[Player_Number][4] + ' / ' + result[Player_Number][1] + ' 풀하우스' // 유저 이름과 풀하우스 숫자 출력
                }
                else // 결과를 저장하는 2차원 배열 5번째열(원페어)에 숫자가 없다면 트리플
                {
                    result[Player_Number][2] = rank; // 결과를 저장하는 2차원 배열 3번째열(트리플)에 rank 저장
                    document.getElementById(Player_Div).innerHTML = Player_Name + ': ' + result[Player_Number][2] + ' 트리플' // 유저 이름과 트리플 숫자 출력
                }
            }

            if ((Player_index.length == 4)) // 배열 인덱스 번호가 4개일시
            {
                result[Player_Number][0] = rank; // 결과를 저장하는 2차원 배열 1번째열(포카드)에 rank 저장
                document.getElementById(Player_Div).innerHTML = Player_Name + ': ' + result[Player_Number][0] + ' 포카드' // 유저 이름과 포카드 숫자 출력
            }

            if (rank == 11 && (result[Player_Number].every(function (element) {
                return element == undefined;
            }))) // 숫자가 14이고, 결과를 저장하는 배열의 행(유저)에 대응하는 열이 모두 빈칸일때 노페어
            {
                result[Player_Number][6] = HighCard; // 결과를 저장하는 2차원 배열 7번째열(노페어)에 rank 저장
                document.getElementById(Player_Div).innerHTML = Player_Name + ': ' + HighCard + ' 노페어' // 유저 이름과 노페어 숫자 출력
            }

            Player_index = []; // 유저의 숫자 갯수를 확인 하는 배열 초기화
            rank++; // 숫자를 1씩 올림
        }
    }

    else { // 유저플래그가 0.9 이상이면
        document.getElementById(Player_Div).innerHTML = Player_Name + ': ' + ' DIE' // 유저 다이 출력
    }
}

/*승리 플레이어에게 총 베팅금 지급 함수*/
function money_to_winner(winner_num, cowinner_num) // 매개변수 : 이긴 유저번호, 공동우승자 번호
{

    if (cowinner_num == 0) // 공동우승자가 없을시
        winner_money += Betting_Account; // 이긴 유저에 모든 배팅금 총합을 더함

    else { // 공동우승자가 있을 시
        Betting_Account /= 2; // 베팅금의 총합을 반으로 나눔

        winner_money += Betting_Account; // 이긴 유저에 배팅금 총합의 50%을 더함
        cowinner_money += Betting_Account; // 공동우승자에게  배팅금 총합의 50%을 더함
    }
    // 이긴 유저 번호에 대응하는 유저의 금액에 우승자 상금을 더함
    if (winner_num == 1) user1._money.value += winner_money;
    if (winner_num == 2) user2._money.value += winner_money;
    if (winner_num == 3) user3._money.value += winner_money;
    if (winner_num == 4) user4._money.value += winner_money;
    if (cowinner_num == 1) user1._money.value += cowinner_money;
    if (cowinner_num == 2) user2._money.value += cowinner_money;
    if (cowinner_num == 3) user3._money.value += cowinner_money;
    if (cowinner_num == 4) user4._money.value += cowinner_money;
}
