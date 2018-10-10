class Player {

    constructor() {
    	this.directions = ["forward","right","backward","left"]
        this.warrior = null
        this.lastHealth = null
        this.lastDamageTaken = 0
        this.lastDirection = "backward"

        this.isUnderAttack = false
        this.isRetreating = false
        this.isHealing = false
    }

    playTurn(warrior) {
        this.warrior = warrior;

        this.isUnderAttack = this.lastHealth > this.warrior.health()
        this.lastDamageTaken = Math.max(this.lastHealth - this.warrior.health(), 0) > 0 ? this.lastHealth - this.warrior.health() : this.lastDamageTaken
        this.lastHealth = this.warrior.health()

        this.warrior.think("Am I under attack? " + this.isUnderAttack)
        this.warrior.think("My last damage taken was " + this.lastDamageTaken)

        if (this.healSequence()) {
        	this.warrior.think("Heal sequence complete")
        } else if(this.attackSequence()) {
        	this.warrior.think("Attack sequence complete")
        } else if (this.rescueSequence()) {
        	this.warrior.think("Rescue sequence complete")
        } else if(this.exploreSequence()) {
        	this.warrior.think("Explore sequence complete")
        } else {
        	this.warrior.think("Failed to complete any sequences")
        }
        this.warrior.think('Turn complete')
    }

    exploreSequence() {
    	this.warrior.think("I'm going to explore.")
    	var exploreDirections = ["backward", "left", "right", "forward"]
		if (this.warrior.feel(this.lastDirection).isEmpty()) {
			this.warrior.think("The way still looks clear, continuing to explore " + this.lastDirection)
			this.warrior.walk(this.lastDirection)
			return true
		}
		this.warrior.think("This way looks blocked, I'm going to find a new direction to explore.")
    	for (var i = exploreDirections.length - 1; i >= 0; i--) {
    		if (this.warrior.feel(exploreDirections[i]).isEmpty()) {
    			this.warrior.think("This way looks clear, exploring " + exploreDirections[i])
    			this.lastDirection = exploreDirections[i]
    			this.warrior.walk(exploreDirections[i])
    			return true
    		}
    	}
    	return false
    }

    healSequence() {
    	if (this.isHealing) {
    		if (this.warrior.health() < 20) {
    			this.warrior.rest()
    			return true
    		}
    		this.isHealing = false
    		return false
    	}
        // do I need to heal?
        if (this.warrior.health() > this.lastDamageTaken * 3) {
            return false
        }
        // am I under attack?
        if (this.isUnderAttack) {
            return this.retreatSequence()
        } else {
        	this.isRetreating = false
        }
        // heal
        this.warrior.think("I'm healing.")
        this.warrior.rest()
        this.isHealing = true
        return true
    }

    retreatSequence() {
    	if (this.isRetreating) {
    		this.warrior.think("I'm retreating " + this.lastDirection)
    		this.isRetreating = true
    		this.warrior.walk(this.lastDirection)
    		return true
    	}
		this.lastDirection = this.oppositeDirection(this.lastDirection)
		this.warrior.think("I'm retreating " + this.lastDirection)
		this.isRetreating = true
		this.warrior.walk(this.lastDirection)
		return true
    }

    attackSequence() {
    	// for each direction, feel if enemy and attack
		if (typeof this.warrior['look'] != 'undefined') {
			return this.lookSequence()
		} else {
			return this.feelSequence()
		}
    }

    feelSequence() {
    	var unit;
    	for (var i = this.directions.length - 1; i >= 0; i--) {
    		if(unit = this.warrior.feel(this.directions[i]).getUnit()) {
    			if (unit.isEnemy()) {
    				this.warrior.attack(this.directions[i])
    				return true
    			}
    		}
    	}
    	return false
    }

    lookSequence() {
    	var unit;
    	for (var i = this.directions.length - 1; i >= 0; i--) {
    		var tiles = this.warrior.look(this.directions[i])
    		for (var z = 0; z < tiles.length; z++) {
    			if (!tiles[z].isEmpty()) {
					if(unit = tiles[z].getUnit()) {
						if (unit.isEnemy()) {
							this.warrior.shoot(this.directions[i])
							return true
						} else {
							return false
						}
					}
				}
    		}
    	}
    	return false
    }

    rescueSequence() {
    	var unit;
    	for (var i = this.directions.length - 1; i >= 0; i--) {
    		if(unit = this.warrior.feel(this.directions[i]).getUnit()) {
    			if (unit.isBound()) {
    				this.warrior.rescue(this.directions[i])
    				return true
    			}
    		}
    	}
    	return false
    }

    eachDirection(check) {
    	for (var i = this.directions.length - 1; i >= 0; i--) {
    		var checkFunction =  new Function(check)
    		if(checkFunction()) {
    			return this.directions[i]
    		}
    	}
    	return false
    }

    oppositeDirection(direction) {
    	switch (direction) {
    		case "backward":
    			return "forward"
			case "forward":
    			return "backward"
			case "left":
    			return "right"
			case "right":
    			return "left"
    	}
    	throw "Unknown direction";
    }
}
