import type { Pizza } from '../types';

export const pizzaData: Pizza[] = [
  {
    id: 1,
    name: "マルゲリータ",
    ingredients: "トマト、モッツァレラ、バジル",
    price: 12,
    photoName: "https://picsum.photos/100/100?random=1",
    soldOut: false,
  },
  {
    id: 2,
    name: "ペパロニ",
    ingredients: "トマト、モッツァレラ、ペパロニ",
    price: 15,
    photoName: "https://picsum.photos/100/100?random=2",
    soldOut: false,
  },
  {
    id: 3,
    name: "ハワイアン",
    ingredients: "トマト、モッツァレラ、ハム、パイナップル",
    price: 16,
    photoName: "https://picsum.photos/100/100?random=3",
    soldOut: false,
  },
  {
    id: 4,
    name: "クワトロフォルマッジ",
    ingredients: "4種類のチーズ",
    price: 18,
    photoName: "https://picsum.photos/100/100?random=4",
    soldOut: true,
  },
  {
    id: 5,
    name: "ベジタリアン",
    ingredients: "トマト、モッツァレラ、野菜各種",
    price: 13,
    photoName: "https://picsum.photos/100/100?random=5",
    soldOut: false,
  },
  {
    id: 6,
    name: "スパイシー",
    ingredients: "トマト、モッツァレラ、スパイシーサラミ、唐辛子",
    price: 17,
    photoName: "https://picsum.photos/100/100?random=6",
    soldOut: false,
  },
];
