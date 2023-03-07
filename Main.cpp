# include <Siv3D.hpp> // OpenSiv3D v0.6.6
# include "Character.h"
void Main()
{
	Scene::SetBackground(Palette::White);
	Array<Character*> germs;
	const Texture riman{ U"image/riman.png" };
	germs << new Character(Scene::Center().x, Scene::Center().y, 0);
	//double t = 0.0;
	bool play_flg = false;
	double t = 0.0;
	while (System::Update())
	{
		if (KeyEnter.pressed()) {
			play_flg = true;
		}
		if (play_flg) {
			ClearPrint();
			t += Scene::DeltaTime();
			int length = germs.size();

			for (int i = 0; i < length; i++) {

				if (t > 2 && germs.size() < 200) {

					germs << germs[i]->increase();

				}
				germs[i]->move();
			}
			if (t > 2)t = 0.0;
			Print << t;
			for (int i = 0; i < germs.size(); i++) {
				riman.drawAt(germs[i]->x, germs[i]->y);
			}
		}
		// テクスチャを座標 (0, 0) を中心に描画
		//riman.drawAt(0, 0);

		// テクスチャを座標 (200, 200) を中心に描画
		//riman.drawAt(200, 200);
	}
}
	
