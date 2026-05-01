# Конспект: база React Native (на примере этого проекта)

Этот проект — **React Native CLI** (не Expo). Исходный вход — `App.tsx`.

## Как это “работает” в целом

- **JS/TS код** (React компоненты) выполняется в React Native runtime.
- **Native часть** (iOS/Android) создаёт окно/экран и рендерит “настоящие” нативные вьюхи.
- Ты описываешь UI в React-стиле (компоненты + state), а RN маппит их на нативные элементы.

## Что смотреть в репозитории

- **`App.tsx`**: корневой компонент (`GestureHandlerRootView`, `SafeAreaProvider`, `NavigationContainer`).
- **`index.js`**: первой строкой импорт `react-native-gesture-handler` (нужен для жестов навигатора).
- **`src/navigation/`**: табы, стеки и типы (`RootNavigator`, `MainTabs`, `MainStack`, `ExtrasStack`, `types.ts`).
- **`src/screens/`**: экраны (`HomeScreen`, `LearningBasicsScreen`, `ExtrasScreen`, `ExtrasPracticeScreen`).
- **`src/components/*`**: маленькие переиспользуемые UI-компоненты.
- **`ios/`**: Xcode проект + `Podfile` (CocoaPods).
- **`android/`**: Gradle проект.

## База React в RN

### Компоненты

- Компонент — функция, которая возвращает JSX.
- В RN нет HTML-тегов (`div`, `span`). Вместо этого:
  - `View` ≈ контейнер
  - `Text` ≈ текст
  - `TextInput` ≈ ввод
  - `Pressable`/`Button` ≈ нажатие
  - `ScrollView` ≈ прокрутка контента, который не помещается на экран
  - `FlatList` ≈ большие списки
  - `KeyboardAvoidingView` - компонент будет автоматически регулировать свою высоту, положение или нижнюю подкладку в зависимости от высоты клавиатуры, чтобы оставаться видимым при отображении виртуальной клавиатуры.

### State

- `useState` хранит данные, которые меняются со временем (счётчик, текст инпута, массив задач).
- Обновляй state **иммутабельно**:
  - массив: `setTodos(prev => [newItem, ...prev])`
  - объект: `setX(prev => ({ ...prev, a: 1 }))`

### Derived state

- Если значение вычисляется из state (например, “сколько задач выполнено”), используй `useMemo`
  или просто вычисляй “на лету”, если дешево.

## База RN UI

### StyleSheet + flexbox

- Стили — это JS-объекты. Чаще всего через `StyleSheet.create({ ... })`.
- Лейаут почти всегда через **flexbox**:
  - `flexDirection: 'row' | 'column'` (по умолчанию `column`)
  - `gap`, `alignItems`, `justifyContent`
  - `flex: 1` — занять доступное пространство

### Safe Area (iPhone с вырезом)

- `react-native-safe-area-context` даёт inset’ы (верх/низ), чтобы контент не уезжал под “чёлку” и индикатор жестов.
- В этом проекте:
  - `SafeAreaProvider` в `App.tsx`
  - Экран **внутри native stack** с заголовком: верх подбирает сам навигатор — у контента достаточно небольшого `paddingTop` в стилях.
  - То же со **вторым табом**: там тоже свой stack с шапкой; отдельные ручные `insets.top` на первом экране не нужны.
  - Низ у длинного контента: у `ScrollView` задан `contentContainerStyle.paddingBottom` с учётом `insets.bottom` (надёжнее, чем только отступ на внешнем контейнере).

### Клавиатура

- На iOS часто используют `KeyboardAvoidingView`, чтобы инпут не закрывался клавиатурой.
- Обычно различаем по `Platform.OS`.

### Прокрутка

- `View` с `flex: 1` **сам по себе не прокручивается**: если дочерние блоки выше экрана, лишнее просто обрежется, пока не обернуть контент в `ScrollView` (или не сделать корневым `FlatList` с `ListHeaderComponent`).
- Вложенный `FlatList` внутри колонки с соседями прокручивает **только свою** область и часто неудобен на формах — для одного общего скролла страницы чаще делают `ScrollView`, а маленький список рендерят через `.map()`.

## Списки

- `FlatList` нужен для производительности: не рендерит сразу всё, виртуализирует.
- Важно:
  - `keyExtractor`
  - `renderItem`
  - `data` — массив

## Навигация (React Navigation)

Веб часто связывают с **URL** (`react-router` и т.д.). В RN маршрут по умолчанию не виден в адресной строке: экраны переключаешь **именами** и **вложенными навигаторами**.

### Зависимости в проекте

- `@react-navigation/native` — ядро, обязателен **`NavigationContainer`** в корне.
- `@react-navigation/native-stack` — нативный стек (анимации и заголовки ближе к платформе).
- `@react-navigation/bottom-tabs` — нижний таб-бар.
- `react-native-screens`, `react-native-gesture-handler` — нативная часть; жесты требуют импорта в **`index.js`** до остального кода.
- Обычно корень: `GestureHandlerRootView` → `SafeAreaProvider` → `NavigationContainer` → навигаторы.

### Как устроено здесь

1. **`MainTabsNavigator`** (`MainTabs.tsx`) — два таба: «Обзор» и «Ещё».
2. Таб **«Обзор»** рендерит **`MainStackNavigator`**: экраны `Home` → `Basics`.
3. Таб **«Ещё»** рендерит **`ExtrasStackNavigator`**: `ExtrasHome` → `ExtrasPractice` (переход `navigation.navigate('ExtrasPractice')` с первого экрана вкладки).

Типы:

- **`RootStackParamList`** — стек таба «Обзор».
- **`ExtrasStackParamList`** — стек таба «Ещё».
- **`MainTabParamList`** — имена табов (`Overview`, `Extras`).

Аналогия с вебом: стек ≈ история «вперёд/назад» внутри раздела; табы ≈ несколько независимых «корневых» разделов приложения.

### Полезные приёмы дальше

- Параметры экрана: `navigate('Detail', { id: '42' })` + типизация в `RootStackParamList`.
- Иконки в табах: `tabBarIcon` (часто подключают библиотеку иконок).
- Сброс стека при смене таба, `listener` на `tabPress` — по необходимости.

## Дальше (что учить следующим шагом)

- **Параметры маршрута и deep linking** (открытие экрана по URL / пушу).
- **Сеть**: `fetch`, обработка ошибок, loading-state, retry.
- **Архитектура**: разделение `screens/`, `components/`, `services/`, `state/`.
- **Состояние**: Context, Zustand, Redux Toolkit (по мере роста).
- **Нативные модули**: когда нужно то, чего нет в JS.

## Как запустить

- Metro:

```sh
npm start
```

- iOS (Pods запускать из `ios/`):

```sh
cd ios && bundle exec pod install
cd .. && npm run ios
```

- Android:

```sh
npm run android
```

