class Player {
  playTurn(warrior) {
	if(warrior.feel().isEmpty()) {
      if(warrior.health() < 20 && this.previousHealth <= warrior.health()) {
        warrior.rest();
      } else {
        warrior.walk();
      }
    } else {
      warrior.attack();
    }
    this.previousHealth = warrior.health()
  }
}
