import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = { primary: "#1f145c", white: "#fff" };
const App = () => {
  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (inputText === "") {
      Alert.alert("Error", "Write something");
    } else {
      const newTodo = {
        id: Math.random(),
        task: inputText,
        completed: false,
      };
      setTodos(prev => [...prev, newTodo]);
      setInputText("");
    }
  };

  const markTodoComplete = todoId => {
    const newTodos = todos?.map(item => {
      if (item?.id === todoId) {
        return { ...item, completed: true };
      }
      return item;
    });
    setTodos(newTodos);
  };

  const deleteTodo = todoId => {
    const newTodos = todos.filter(item => item?.id !== todoId);
    setTodos(newTodos);
  };

  const clearTodos = () => {
    Alert.alert("Confirm", "Clear Todos", [
      {
        text: "Yes",
        onPress: () => setTodos([]),
      },
      {
        text: "NO",
      },
    ]);
  };
  const ListItem = ({ todo }) => {
    return (
      <>
        <View style={styles.listItem}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? "line-through" : "none",
            }}
          >
            {todo?.task}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            position: "relative",
            bottom: 0,
          }}
        >
          {!todo?.completed && (
            <TouchableOpacity
              style={[styles.actionIcon]}
              onPress={() => markTodoComplete(todo?.id)}
            >
              <Icon name="done" size={25} color={COLORS.white} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionIcon]}
            onPress={() => deleteTodo(todo?.id)}
          >
            <Icon name="delete" size={25} color="red" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const saveTodosToUserDevice = async todos => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem("NativeTodos", jsonValue);
    } catch (e) {
      console.error("error", e);
    }
  };

  useEffect(() => {
    saveTodosToUserDevice(todos);
  }, [todos]);

  const getTodosFromUsersDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem("NativeTodos");
      if (todos !== null) {
        setTodos(JSON.parse(todos));
      }
    } catch (e) {
      console.log("error", e);
    }
  };
  useEffect(() => {
    getTodosFromUsersDevice();
  }, []);

  return (
    <SafeAreaView style={styles.borderBox}>
      <View style={styles.header}>
        <Text style={styles.headStyle}>TODO_APP</Text>
        <TouchableOpacity onPress={clearTodos}>
          <Icon name="delete" size={25} color="red" />
        </TouchableOpacity>
      </View>
      {todos.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          data={todos}
          renderItem={({ item }) => <ListItem todo={item} />}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontWeight: "600",
              color: COLORS.primary,
              textTransform: "uppercase",
              textDecorationLine: "underline ",
            }}
          >
            Plan Your Day
          </Text>
        </View>
      )}
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={{ position: "absolute", top: 10, left: 20 }}
            placeholder="Add Todo"
            value={inputText}
            onChangeText={text => setInputText(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" size={30} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  borderBox: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  headStyle: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 10,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingHorizontal: 15,

    alignItems: "center",
    flexDirection: "row",
  },
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    elevation: 12,
    borderColor: "red",
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 3,
  },
});

export default App;
