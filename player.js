class Player {

    constructor() {
    	this.directions = ["forward","right","backward","left"]
        this.warrior = null
        this.lastDamageTaken = 0
        this.isRetreating = false
        this.lastDirection = "backward"
    }

    playTurn(warrior) {
        this.warrior = warrior;

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
    	var exploreDirections = ["backward", "left", "right", "forward"]
		if (this.warrior.feel(this.lastDirection).isEmpty()) {
			this.warrior.talk("The way still looks clear, continuing to explore " + this.lastDirection)
			this.warrior.walk(this.lastDirection)
			return true
		}
		this.warrior.talk("This way looks blocked, I'm going to find a new direction to explore.")
    	for (var i = exploreDirections.length - 1; i >= 0; i--) {
    		if (this.warrior.feel(exploreDirections[i]).isEmpty()) {
    			this.warrior.talk("This way looks clear, exploring " + this.exploreDirections[i])
    			this.lastDirection = exploreDirections[i]
    			this.warrior.walk(exploreDirections[i])
    			return true
    		}
    	}
    	return false
    }

    healSequence() {
        // do I need to heal?
        if (this.warrior.health() > this.lastDamageTaken * 2) {
            return false
        }
        // am I under attack?
        if (this.isUnderAttack) {
            return this.retreatSequence()
        }
        // heal
        this.warrior.heal();
        return true
    }

    retreatSequence() {
    	if (this.isRetreating) {
    		this.warrior.walk(this.lastDirection)
    	} else {
    		this.lastDirection = this.oppositeDirection(this.lastDirection)
    		this.isRetreating = true
    		this.warrior.walk()
    	}
    	return true
    }

    attackSequence() {
    	// for each direction, feel if enemy and attack
    	// for (var i = this.directions.length - 1; i >= 0; i--) {
    	// 	if(this.warrior.feel(this.directions[i]).isEnemy()) {
    	// 		this.warrior.attack(this.directions[i])
    	// 		return true
    	// 	}
    	// }
    	if (var direction = this.eachDirection("this.warrior.feel(this.directions[i]).getUnit().isEnemy()")) {
    		this.warrior.attack(direction)
    		return true
    	}
    	return false
    }

    rescueSequence() {
    	if (var direction = this.eachDirection("this.warrior.feel(this.directions[i]).getUnit().isBound()")) {
    		this.warrior.attack(direction)
    		return true
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
