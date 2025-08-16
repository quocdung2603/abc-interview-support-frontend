import Banner from './components/Banner';
import ChallengeBanner from './components/ChallengeBanner';
import FeaturedQuizzes from './components/FeaturedQuizzes';
import HowToUseQuiz from './components/HowToUseQuiz';
import NewsSection from './components/NewsSection';
import PracticeWithFriends from './components/PracticeWithFriends';
import RandomQuiz from './components/RandomQuiz';

const Landing = () => {
  return (
    <div>
      <Banner />
      <ChallengeBanner />
      <HowToUseQuiz />
      <RandomQuiz />
      <PracticeWithFriends />
      <FeaturedQuizzes />
      <NewsSection />
    </div>
  );
};

export default Landing;
