const Names = ["bolice", "akisa", "robert"];
function NamesPassedInAsAListGroup() {
  return (
    <>
      <h1>Names passed in as list grouups.</h1>
      <ul className="Names-group">
        {NamesPassedInAsAListGroup.map((Name) => {
          <li>{NamesPassedInAsAListGroup}</li>;
        })}
      </ul>
    </>
  );
}
export default Names;
