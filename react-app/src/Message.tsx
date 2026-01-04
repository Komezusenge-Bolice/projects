function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function Message() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
