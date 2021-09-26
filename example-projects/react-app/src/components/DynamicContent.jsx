import react from 'react';

function DynamicContent(props) {
  const { apiValue } = props;

  return (
    <div>
      <span>Data and {apiValue} from api</span>
      <span>{apiValue}</span>
    </div>
  );
}

export default DynamicContent;