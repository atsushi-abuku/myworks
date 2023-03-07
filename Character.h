#pragma once
class Character
{
	public:
		Character(float x, float y,int id);
		Character* increase();
		void move();
		float x;
		float y;
	protected:
		int id;
		

};

