class Player {
  playTurn(warrior) {
	if(warrior.feel().isEmpty()) {
      if(warrior.health() < 20 && this.previousHealth <= warrior.health()) {
        warrior.rest();
      } else {
        warrior.walk();
      }
    } else {
      if(warrior.feel().getUnit().isEnemy()) {
        warrior.attack();
      } else if(warrior.feel().getUnit().isBound()) {
        warrior.rescue();
      }
    }
    this.previousHealth = warrior.health()
  }
}
