import ReactDOM from 'react-dom';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { Provider } from 'react-redux';

import { store } from './store';
import TextEditor from './components/TextEditor';

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <TextEditor />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
