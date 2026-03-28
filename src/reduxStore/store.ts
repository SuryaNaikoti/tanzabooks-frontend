import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { userReducer, designReducer, pathReducer } from './reducers';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth_token', 'userDetails', 'firstVisit']
}

const rootReducer = combineReducers({
    userReducer: persistReducer(persistConfig, userReducer),
    designReducer: persistReducer(persistConfig, designReducer),
    pathReducer: persistReducer(persistConfig, pathReducer),
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>
