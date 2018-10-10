class Player {
  constructor() {
    this.directions = Object.freeze({"backward":"backward", "forward":"forward", "right":"right", "left":"left"})
    this.isUnderAttack = false
    this.moveStack = [{
        "direction":"backward",
        "action":"walk",
        "health":20,
        "underAttack":this.isUnderAttack
      }]
  }
  playTurn(warrior) {
    this.isUnderAttack = this.previousHealth > warrior.health();
    
    this.action = this.orient(warrior)

    if (this.action.direction) {
      this.moveStack.push({
        "direction":this.action.direction,
        "action":this.action.action,
        "health":warrior.health(),
        "underAttack":this.isUnderAttack
      })
    }

    switch (this.action.action) {
      case "attack":
        warrior.attack(this.action.direction)
        break;
      case "rescue":
        warrior.rescue(this.action.direction)
        break;
      case "walk":
        warrior.walk(this.action.direction)
        break;
      case "pivot":
        warrior.pivot()
        break;
      default:
        warrior.rest()
        break;
    }
    this.previousHealth = warrior.health()
  }

  orient(warrior) {

    if (this.shouldHeal(warrior)) {
      if (this.isUnderAttack) {
        if (this.getPreviousMove().action == "walk") {
          warrior.think("I'm under attack and I will keep walking away")
          if (warrior.feel(this.getPreviousMove().direction).isEmpty()) {
            return {
              "direction": this.getPreviousMove().direction,
              "action":"walk"
            }
          } else if (warrior.feel(this.oppositeDirection(this.getPreviousMove())).isEmpty()) {
            return {
              "direction": this.oppositeDirection(this.getPreviousMove()),
              "action":"walk"
            }
          } else {
            for (var direction in this.directions) {
              var feel = warrior.feel(direction)
              if(feel.isEmpty()) {
                return {
                  "direction": direction,
                  "action":"walk"
                }
              }
            }
          }
        } else {
          warrior.think("I'm under attack and I need to go the opposite way")
          return {
            "direction": this.oppositeDirection(this.getPreviousMove()),
            "action":"walk"
          }
        }
      } else {
        return {
          "direction": this.getPreviousMove().direction,
          "action":"rest"
        }
      }
    } 

    for (var direction in this.directions) {
      var feel = warrior.feel(direction)
      if(feel.getUnit()) {
        var unit = feel.getUnit()
        if (unit.isEnemy()) {
          return {
            "direction":direction,
            "action":"attack"
          }
        }
      }
    }

    for (var direction in this.directions) {
      var feel = warrior.feel(direction)
      if(feel.getUnit()) {
        var unit = feel.getUnit()
        if (unit.isBound()) {
          return {
            "direction":direction,
            "action":"rescue"
          }
        }
      }
    }

    if (this.getPreviousMove().action == "rest") {
      warrior.think("I'm done resting and now I need to go back " + this.oppositeDirection(this.getPreviousMove()))
      return {
        "direction": this.oppositeDirection(this.getPreviousMove()),
        "action":"walk"
      }
    } else if(!warrior.feel(this.getPreviousMove().direction).isWall()) {
      warrior.think("I'm walking")
      return {
        "direction": this.getPreviousMove().direction,
        "action":"walk"
      }
    } else {
      warrior.think("I'm walking")
      return {
        "direction": this.getPreviousMove().direction,
        "action":"pivot"
      }
    }

    // if we get this far without a more important action happening, walk
    for (var direction in this.directions) {
      var feel = warrior.feel(direction)
      if (feel.isEmpty()) {
        return {
          "direction":direction,
          "action":"walk"
        }
      }
    }
  }

  getPreviousMove() {
    return this.moveStack[this.moveStack.length - 1]
  }

  shouldHeal(warrior) {
    if (warrior.health() < 20 && !this.isUnderAttack) {
      return true;
    }
    if (warrior.health() < 10 && this.isUnderAttack) {
      return true;
    }
    return false;
  }

  oppositeDirection(previousMove) {

    switch (previousMove.direction) {
      case "forward":
        return "backward"
        break;
      case "backward":
        return "forward"
        break;
      case "left":
        return "right"
        break;
      case "right":
        return "left"
        break;
      default:
        return "backward"
        break;
    }

  }

}
