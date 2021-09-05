import React from 'react';
import './song-lyric.css';


interface IProps {
  album?: string,
  name?: string,
}

function SongList (props: IProps) :React.ReactElement {
  return (
    <div className="song-lyric">
      <p className="container">
        作词 : 林振强
        作曲 : A Kyte T.Baker
        击鼓声火热火熨
        燃烧的心兴奋流汗
        一双腿只愿起舞
        几点都不讲晚安
        今宵应自动奔放
        行动应高速彷似浪
        来吧你快快别坐一角
        只懂得把我凝望
        it&#39;s such a physical night
        你不要浪费
        do you wanna dance tonight?
        it&#39;s such a physical night
        不要浪费
        do you wanna hold me tight?
        it&#39;s such a physical night
        再等会浪费
        do you wanna dance tonight?
        it&#39;s such a physical night
        不要浪费
        do you wanna hold me tight?

        击鼓声急劲火熨
        萤光恤衫跟我摇荡
        一双手左右飞舞
        高速得不可以绑
        一颗心若是火熨
        无谓多拘束多作状
        来吧你快快别坐一角
        紧张得手脚流汗

        it&#39;s such a physical night
        你不要浪费
        do you wanna dance tonight?
        it&#39;s such a physical night
        不要浪费
        do you wanna hold me tight?
        it&#39;s such a physical night
        再等会浪费
        do you wanna dance tonight?
        it&#39;s such a physical night
        不要浪费
        do you wanna hold me tight?

        it&#39;s such a physical night
        你不要浪费
        do you wanna dance tonight?
        it&#39;s such a physical night
        不要浪费
        do you wanna hold me tight?
        无谓坐 （无谓坐）
        无谓坐 （无谓坐）
        无谓坐 （无谓坐）
        呆坐我家中雪柜
        移近我 （i love you）
        移近我 （i need you）
        移近我 （i love you）
        移近我
        it&#39;s gonna dance all night
        不要浪费
        do you wanna dance tonight?
        it&#39;s such a physical night
        不要浪费
        do you wanna hold me tight?
        it&#39;s such a physical night
        你不要浪费
        do you wanna dance tonight?
        it&#39;s such a physical night
        不要浪费
        do you wanna hold me tight?
      </p>
    </div>
  );
}

export default SongList;