import type { NextPage } from 'next';
import Game from '../components/Game';

const Home: NextPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Game />
    </div>
  );
};

export default Home;
