class Player {
  playTurn(warrior) {
	if(warrior.feel().isEmpty()) {
      if(warrior.health() < 20) {
        warrior.rest();
      } else {
        warrior.walk();
      }
    } else {
      warrior.attack();
    }
  }
}
