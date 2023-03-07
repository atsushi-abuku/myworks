#include "stdafx.h"
#include "Character.h"

Character::Character(float x,float y,int id) {
	this->id = id;
	this->x = x;
	this->y = y;
}

Character* Character::increase() {
	Character *chara = new Character(this->x, this->y, this->id);
	return chara;
}

void Character::move() {
	this->x += Random(-2.0f, 2.0f);
	this->y += Random(-2.0f, 2.0f);
}
