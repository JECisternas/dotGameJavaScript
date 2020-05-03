const board = document.getElementById('id-board')
let className
let colorPlayer = 'rgb(72, 209, 204)' 
let colorBoard = 'rgb(250, 250, 250)'
let colorPlayer1 = 'rgb(72, 209, 204)'
let colorPlayer2 = 'rgb(255, 165, 0)'
let coord = ''
let countPlayer1 = 0, countPlayer2 = 0
let maxJ
let squaresClaimed = 0
let topG,leftG
let totalsquaresClaimed = 0
let num_of_players = 1

let time_control
let intervalo_2000
let seconds_delay = 10000

document.getElementById('id_radio_one').checked = true

document.getElementById('id_radio_one').addEventListener('click', e => {
  if(e){ num_of_players = 1}
})
document.getElementById('id_radio_two').addEventListener('click', e => {
  if(e){ num_of_players = 2}
})

// Draws rectangles and squares  --------------------------------------
/*  Groups of rectangles have a similar behavior to be processed:
      Group 1: Horizontal rectangles in the row on the top of the board     (t-h-r)
      Group 2: Horizontal rectangles in the row on the bottom of the board  (b-h-r)
      Group 3: Horizontal rectangles in the middle area of the board        (m-h-r)
      Group 4: Vertical rectangles in the column on the left of the board   (l-v-r)
      Group 5: Vertical rectangles in the column on the right of the board  (r-v-r)
      Group 6: Vertical rectangles in the middle area of the board          (m-v-r)
*/

let rect = (max,h,w,or) => {
  if (or === 'hor'){
    maxJ = max - 1      // to control the last row on the bottom of the board
    topG = 4, leftG = 22   // Starting point, for horizontal rectangles
  }else if( or === 'ver'){
    maxJ = max + 1      // to control the last column on the right of the board
    topG = 22, leftG = 4   // Starting point, for vertical rectangles
  }else{  // squares
    maxJ = max
    topG = 22, leftG = 22   // Starting point, for squares
  }    

  for(let j = 1; j<= maxJ; j++){ 
    for(let i = 1; i<=max; i++){
      if     (or === 'hor' && i === 1){className = 'top-hor-rect'}
      else if(or === 'hor' && i === max){className = 'bottom-hor-rect'}
      else if(or === 'ver' && j === 1){className = 'left-ver-rect'}
      else if(or === 'ver' && j === maxJ){className = 'right-ver-rect'}
      else if(or === 'hor' && i !== 1 && i !== max){className = 'middle-hor-rect'}
      else if(or === 'ver' && j !== 1 && j !== maxJ){className = 'middle-ver-rect'}
      else if(or === 'sqr'){className = 'squares'}

      coord = i + '' + j  // Makes the "id" unique for every rectangle and square. It will be contatenated with a prefix
      // eval lets work the name of variables as a variable
      eval('let rectangle' + coord )  // Different variables are necessary to create diferent Elements   
      let varName = `rectangle${coord}` // Variable with variable name
      eval(varName + '= document.createElement("div")')
      eval(varName + '.style.height = "'  +  h + 'px' + '"')
      eval(varName + '.style.width ="'  +  w + 'px' + '"')
      eval(varName + '.style.border = "1px solid black" ')
      if(or === 'sqr'){
        eval(varName + '.style.background = "rgba(220, 240, 230, .5)" ')
      }else{
        eval(varName + '.style.background = "rgb(250, 250, 250)" ')
      }
      eval(varName + '.style.position = "absolute" ')
      eval(varName + '.style.left ="'  +  leftG + 'px' + '"')
      eval(varName + '.style.top = "'  +  topG + 'px' + '"')
      eval(varName + '.classList = "' + className + '"')    
      if (or === 'hor'){
        eval(varName + '.id = "h' + coord + '"')    // h11, h12...h76
      }else if( or === 'ver'){
        eval(varName + '.id = "v' + coord + '"')    // v11, v12...v67
      }else{  // squares
        eval(varName + '.id = "s' + coord + '"')    // s11, s12...s66
      }  
      eval('board.appendChild(' + varName +')')
      topG += 56
    }
    if (or === 'hor'){
      topG = 4, leftG += 57
    }else if( or === 'ver'){
      topG = 22, leftG += 57
    }else{  // 'sqr'
      topG = 22, leftG += 57
    }     
  }
}
// -------------------------------------------------------------------------------
// Draws circles with clonation method.
// Clones the svg-template inside the HTML to append it into the id-board div
coord = ''
leftG = 10
const template = document.getElementById('svg-template')
const newTemplate = template.content.cloneNode(true)
board.appendChild(newTemplate)
// Gets the circle element inside the svg element inside the svg-template to clone it
let coll_cir_idsvg = document.getElementsByTagName('circle')
let cir =  coll_cir_idsvg[0]

 // Clones and draws every circle
 // TIP: cloneNode(true) must be done for every clonation
let circles = (max,d) => {
  for(let j = 1; j<= max; j++){ 
    topG = 10
    for(let i = 1; i<= max; i++){
      coord = i + '' + j
      let newCir = `newCir${coord}`
      let newCirClone = `cirClone${coord}`
      eval(newCirClone + '= cir.cloneNode(true)')
      eval(newCir + '= document.getElementById("id-svg").appendChild(' + newCirClone+ ')')
      eval(newCir + '.setAttribute("cx","' + leftG +'")')
      eval(newCir + '.setAttribute("cy","' + topG +'")')

      topG += 56
    }
    leftG += 57 
   }
 }
 //---------------------------------------------------------------------------------


// Draws circles
circles(7,20)
// Draws horizontal rectangles
rect(7,15,36,'hor')
// Draws vertical rectangles
rect(6,35,15,'ver')
// Draws squares
rect(6,35,36,'sqr')


//---------------------------------------------------------------------------------
// Detects the rectangles where the click was done and the group to which it belongs
document.getElementById('id-board').addEventListener('click', e => {
  let elementClicked = e.target
  if(elementClicked.className === 'top-hor-rect'){claimRect(elementClicked.id,'claimSquare_t_h_r')}
    else if (elementClicked.className === 'bottom-hor-rect'){claimRect(elementClicked.id,'claimSquare_b_h_r')}
    else if (elementClicked.className === 'middle-hor-rect'){claimRect(elementClicked.id,'claimSquare_m_h_r')}
    else if (elementClicked.className === 'left-ver-rect'){claimRect(elementClicked.id,'claimSquare_l_v_r')}
    else if (elementClicked.className === 'right-ver-rect'){claimRect(elementClicked.id,'claimSquare_r_v_r')}
    else if (elementClicked.className === 'middle-ver-rect'){claimRect(elementClicked.id,'claimSquare_m_v_r')}
})
//---------------------------------------------------------------------------------------------
// Checks if the rectangle has not been claimed yet. if not, it is claimed by the player
function claimRect(id,claimSquare){
  let element = document.getElementById(id)  
  let color = element.style.backgroundColor
  if( color === colorBoard){   //'not assigned'
      if(colorPlayer === colorPlayer1){
        element.style.backgroundColor = colorPlayer1  // Rectangle claimed by player1
        if (eval('!' + claimSquare + '(id, "rgb(72, 209, 204)")')){
          colorPlayer = colorPlayer2
          if (num_of_players === 1){device_player()}
        }else{
          countPlayer1 +=  squaresClaimed
          totalsquaresClaimed += squaresClaimed
          showscore('player1',countPlayer1)
        }
      }else{
        element.style.backgroundColor = colorPlayer2  // Rectangle claimed by player2
        if (eval('!' + claimSquare + '(id, "rgb(255, 165, 0)")')){
          colorPlayer = colorPlayer1
        }else{
          countPlayer2 +=   squaresClaimed
          totalsquaresClaimed += squaresClaimed
          showscore('player2',countPlayer2)
        }
      }
  }
}
// ===========================================================================================
// Checks if the claimed rectangle has to claim any adjacent square
function claimSquare_t_h_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  squaresClaimed = 0
  if (document.getElementById(`v${id_xy}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy}`).style.background = color
      squaresClaimed++
      return true
  }else{
      return false
  }
}
//--------------------------------------------------------------------------------------------
function claimSquare_b_h_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  squaresClaimed = 0
  if (document.getElementById(`v${id_xy - 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy - 9}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy - 10}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy - 10}`).style.background = color
      squaresClaimed++
      return true
  }else{
      return false
      }
}
//--------------------------------------------------------------------------------------------
function claimSquare_m_h_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  squaresClaimed = 0
  let count = 0
  if (document.getElementById(`h${id_xy - 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy - 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy - 9}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy - 10}`).style.background = color
      count++
      squaresClaimed++
    }
  if (document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy}`).style.background = color
      count++
      squaresClaimed++
    } 
  if(count > 0){return true}  else {return false}
}
//--------------------------------------------------------------------------------------------
function claimSquare_l_v_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  squaresClaimed = 0
  if (document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy}`).style.background = color
      squaresClaimed++
      return true
    }else{
      return false
      }
}
//--------------------------------------------------------------------------------------------
function claimSquare_r_v_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  squaresClaimed = 0
  if (document.getElementById(`v${id_xy - 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy - 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 9}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy - 1}`).style.background = color
      squaresClaimed++
      return true
  }else{
      return false
      }
}
//--------------------------------------------------------------------------------------------
function claimSquare_m_v_r(id ,color){
  const id_xy = parseInt(id.substr(1,2),10)
  squaresClaimed = 0
  let count = 0
  if (document.getElementById(`h${id_xy - 1}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 9}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy - 1}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy - 1}`).style.background = color
      count++
      squaresClaimed++
    }
  if (document.getElementById(`h${id_xy}`).style.backgroundColor != colorBoard &&
      document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard &&
      document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard){
      document.getElementById(`s${id_xy}`).style.background = color
      count++
      squaresClaimed++
    } 
   if(count > 0){return true}  else {return false}
}

// ===========================================================================================
// The device checks if the current rectangle is claimed, gives the oponnent the posibility to claim any adjacent square
// If count < 2 --> the oponnent can't claim any adjacent square

let rect_claimed_around_square_t_h_r = (id) =>{
  const id_xy = parseInt(id.substr(1,2),10)
  let count = 0
  if (document.getElementById(`v${id_xy}`).style.backgroundColor != colorBoard) count++
  if (document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard) count++ 
  if(document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard) count++
  return count
}
//--------------------------------------------------------------------------------------------
let rect_claimed_around_square_b_h_r = (id) =>{
  const id_xy = parseInt(id.substr(1,2),10)
  let count = 0
  if (document.getElementById(`v${id_xy - 10}`).style.backgroundColor != colorBoard) count++
  if (document.getElementById(`v${id_xy - 9}`).style.backgroundColor != colorBoard) count++ 
  if (document.getElementById(`h${id_xy - 10}`).style.backgroundColor != colorBoard) count++
  return count
}
//--------------------------------------------------------------------------------------------
let rect_claimed_around_square_m_h_r = (id) =>{
  const id_xy = parseInt(id.substr(1,2),10)
  let count1 = 0
  let count2 = 0
  let count = 0
  if (document.getElementById(`h${id_xy - 10}`).style.backgroundColor != colorBoard) count1++
  if (document.getElementById(`v${id_xy - 10}`).style.backgroundColor != colorBoard) count1++ 
  if (document.getElementById(`v${id_xy - 9}`).style.backgroundColor != colorBoard) count1++


  if (document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard) count2++
  if (document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard) count2++ 
  if (document.getElementById(`v${id_xy}`).style.backgroundColor != colorBoard) count2++
  if(count1 > 1 || count2 > 1){count = 2}
  return count
}
//--------------------------------------------------------------------------------------------
let rect_claimed_around_square_l_v_r = (id) =>{
  const id_xy = parseInt(id.substr(1,2),10)
  let count = 0
  if (document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard) count++
  if (document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard) count++
  if (document.getElementById(`h${id_xy}`).style.backgroundColor != colorBoard) count++
  return count
}
//--------------------------------------------------------------------------------------------
let rect_claimed_around_square_r_v_r = (id) =>{
  const id_xy = parseInt(id.substr(1,2),10)
  let count = 0
  if (document.getElementById(`v${id_xy - 1}`).style.backgroundColor != colorBoard) count++
  if (document.getElementById(`h${id_xy - 1}`).style.backgroundColor != colorBoard) count++
  if (document.getElementById(`h${id_xy + 9}`).style.backgroundColor != colorBoard) count++
  return count
}
//--------------------------------------------------------------------------------------------
let rect_claimed_around_square_m_v_r = (id) =>{
  const id_xy = parseInt(id.substr(1,2),10)
  let count1 = 0
  let count2 = 0
  let count = 0
  if (document.getElementById(`h${id_xy - 1}`).style.backgroundColor != colorBoard) count1++
  if (document.getElementById(`h${id_xy + 9}`).style.backgroundColor != colorBoard) count1++ 
  if (document.getElementById(`v${id_xy - 1}`).style.backgroundColor != colorBoard) count1++

  if (document.getElementById(`h${id_xy}`).style.backgroundColor != colorBoard) count2++
  if (document.getElementById(`h${id_xy + 10}`).style.backgroundColor != colorBoard) count2++ 
  if (document.getElementById(`v${id_xy + 1}`).style.backgroundColor != colorBoard) count2++

  if(count1 > 1 || count2 > 1){count = 2}
  return count
}

// ===========================================================================================
// Device as a player
function device_player(){
  let color
  let element

  while (colorPlayer === colorPlayer2){
    let more_squares_to_claim
    let id_rect_to_claim = []
    squaresClaimed = 0
    let id
    let i, j
    // does this upto there is no chance to claim squares
    do{  
      i = 1
      more_squares_to_claim = 0
      // Checks every horizontal rectangle if they had the chance to claim squares -----------
      while(i <=7){
        j = 1
        while (j <= 6){
          id = 'h'+i+j
          element = document.getElementById(id)          
          color = element.style.backgroundColor
          if(color !== colorBoard){
            j++
          }else{
            color = colorPlayer2
            if(i === 1){
              if(claimSquare_t_h_r(id,color)){
                element.style.backgroundColor = colorPlayer2
                countPlayer2 +=  squaresClaimed
                totalsquaresClaimed += squaresClaimed
                more_squares_to_claim++
                squaresClaimed = 0
            }
            }
            else if(i === 7){
              if(claimSquare_b_h_r(id,color)){
                element.style.backgroundColor = colorPlayer2
                countPlayer2 +=  squaresClaimed
                totalsquaresClaimed += squaresClaimed
                more_squares_to_claim++
                squaresClaimed = 0
            }
            }
            else if(i !== 1 && i !== 7){
              if(claimSquare_m_h_r(id,color)){
                element.style.backgroundColor = colorPlayer2
                countPlayer2 +=  squaresClaimed
                totalsquaresClaimed += squaresClaimed
                more_squares_to_claim++
                squaresClaimed = 0
            }
            }
            j++
          } 
        } 
        i++
      } 

      // Checks every vertical rectangle if they had the chance to claim a square
      i = 1
      while(i <=6){
        j = 1
        while (j <= 7){
          id = 'v'+i+j
          element = document.getElementById(id)
          color = element.style.backgroundColor
          if(color !== colorBoard){
            j++
          }else{  
            color = colorPlayer2
            if(j === 1){
              if(claimSquare_l_v_r(id,color)){
                element.style.backgroundColor = colorPlayer2
                countPlayer2 +=  squaresClaimed
                totalsquaresClaimed += squaresClaimed
                more_squares_to_claim++
                squaresClaimed = 0
              }
            }
            else if(j === 7){
              if(claimSquare_r_v_r(id,color)){
                element.style.backgroundColor = colorPlayer2
                countPlayer2 +=  squaresClaimed
                totalsquaresClaimed += squaresClaimed
                more_squares_to_claim++
                squaresClaimed = 0
            }
            }
            else if(j !== 1 && j !== 7){
            
              if(claimSquare_m_v_r(id,color)){
                element.style.backgroundColor = colorPlayer2
                countPlayer2 +=  squaresClaimed
                totalsquaresClaimed += squaresClaimed
                more_squares_to_claim++
                squaresClaimed = 0
            }
            }
            j++
          }
        } 
        i++
      }
    }while(more_squares_to_claim != 0)


    // If there is no more chance to claim squares, checks for every horizontal rectangle that do not give
    // the oponnent the chance to claim any square. Keeps the rectangle-element-id in a array

    i = 1
    while(i <= 7){
      j = 1
      while (j <= 6){
        id = 'h'+i+j
        element = document.getElementById(id)          
        color = element.style.backgroundColor
        if(color !== colorBoard){
          j++
        }else{
          if(i === 1){
            if(rect_claimed_around_square_t_h_r(id) < 2){
              id_rect_to_claim.push(id)
            }
          }
          else if(i === 7){
            if(rect_claimed_around_square_b_h_r(id) < 2){
              id_rect_to_claim.push(id)
            }
          }
          else if(i !== 1){
            if(rect_claimed_around_square_m_h_r(id) < 2){
              id_rect_to_claim.push(id)
            }
          }
          j++
        } 
      } 
      i++
    }

    // If there is no more chance to claim squares, checks for every vertical rectangle that do not give
    // the oponnent the chance to claim any square. Keeps the rectangle-element-id in a array

    i = 1
    while(i <=6){
      j = 1
      while (j <= 7){
        id = 'v'+i+j
        element = document.getElementById(id)
        color = element.style.backgroundColor
        if(color !== colorBoard){
          j++
        }else{  
          if(j === 1){
            if(rect_claimed_around_square_l_v_r(id) < 2){
              id_rect_to_claim.push(id)                  
            }
          }
          else if(j === 7){
            if(rect_claimed_around_square_r_v_r(id) < 2){
              id_rect_to_claim.push(id)    
            }
          }
          else if(j !== 1 && j !== 7){
            if(rect_claimed_around_square_m_v_r(id) < 2){
              id_rect_to_claim.push(id)    
            }
          }
          j++
        }
      } 
      i++
    }
    // Rescues an id from the array in a random way to claimed
      if (id_rect_to_claim.length !== 0){ 
        let index = randomNumber(0, id_rect_to_claim.length)
        id = id_rect_to_claim[index]
        element = document.getElementById(id)          
        element.style.backgroundColor = colorPlayer2
        colorPlayer = colorPlayer1
      }else{      
        any_rect_to_claim()
        colorPlayer = colorPlayer1
      }
    showscore('player2',countPlayer2)
    
  } //end while(colorPlayer === colorPlayer1)
} //end function device_player
// ===========================================================================================

// Looks for any free rectangle 
function any_rect_to_claim(){
  let rect_to_paint = []
  let i, j
  i = 1
  while(i <=7){
    j = 1
    while (j <= 6){
      id = 'h' + i + j
      element = document.getElementById(id)          
      color = element.style.backgroundColor
      if(color === colorBoard){
        rect_to_paint.push(id)
      }
      j++
    }
    i++
  }

  i = 1
  while(i <=6){
    j = 1
    while (j <= 7){
      id = 'v'+i+j
      element = document.getElementById(id)          
      color = element.style.backgroundColor
      if(color === colorBoard){
        rect_to_paint.push(id)
      }
      j++
    }
    i++
  }

  if(rect_to_paint.length !== 0){
    let index = randomNumber(0, rect_to_paint.length)
    id = rect_to_paint[index]
    element = document.getElementById(id)          
    element.style.backgroundColor = colorPlayer2
  }
}
// ===========================================================================================
function showscore(player,SquaresClaimed){
  let count1 = 0, count2 = 0
  let score1, score2
  if (player === 'player1'){
    count1 = SquaresClaimed
    document.getElementById('div-player1').innerHTML = SquaresClaimed
  }else{
    count2 = countPlayer2
    document.getElementById('div-player2').innerHTML = SquaresClaimed
  }
  if(totalsquaresClaimed === 36){ //game over
    count2 = 36 - count1
    let gameOver = document.getElementById('id-board')
    gameOver.style.background = '#EAFAF1'
    score1 = document.getElementById('div-player1')
    score2 = document.getElementById('div-player2')

    if (count1 > count2){
      intervalo_2000 = setInterval(() => { 
        if (score1.style.fontSize === '30px') {
          score1.style.fontSize = '45px' 
        }else{
          score1.style.fontSize = '30px' 
        }
      }, 1000);
    }else{
      intervalo_2000 = setInterval(() => { 
        if (score2.style.fontSize === '30px') {
          score2.style.fontSize = '45px' 
        }else{
          score2.style.fontSize = '30px' 
        }
      }, 1000);
    }
  }
}
// ===========================================================================================

function randomNumber(min, max) {  
  return Math.floor(Math.random() * (max - min) + min); 
}

const btnRestart = document.getElementById("id-btn-close")
btnRestart.addEventListener('click', () => {
clearInterval(intervalo_2000)
document.getElementById('id_radio_one').checked = true
window.location.reload()
})

