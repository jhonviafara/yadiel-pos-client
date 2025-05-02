import PropTypes from "prop-types";

function StyledInput({
  placeholder,
  type,
  TLLabel,
  TRLabel,
  BLLabel,
  BRLabel,
  inputRef,
  // eslint-disable-next-line react/prop-types
  onChange,
  // eslint-disable-next-line react/prop-types
  textColor,
  focus,
  min,
  id,
  name,
  value
}) {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className={`text-label underline ${textColor}`}>{TLLabel}</span>
        <span className={`text-label-alt ${textColor}`}>{TRLabel}</span>
      </div>
      <input
        autoFocus={focus}
        min={min}
        id={id}
        name={name}
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        className="input input-bordered w-full  rounded-full max-w-xs bg-white focus:border-none ring-1 ring-transparent input-bordered border-primary focus:ring-1 focus:ring-blue-400 focus:outline-none"
        onChange={onChange}
      />
      <div className="label">
        <span className={`text-label-alt ${textColor}`}>{BLLabel}</span>
        <span className={`text-label-alt ${textColor}`}>{BRLabel}</span>
      </div>
    </label>
  );
}

StyledInput.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  TLLabel: PropTypes.string,
  TRLabel: PropTypes.string,
  BLLabel: PropTypes.string,
  BRLabel: PropTypes.string,
  inputRef: PropTypes.object,
  id: PropTypes.string,
  name:PropTypes.string,
  value:PropTypes.oneOfType([ // voy a poder tener dos tipos de  datos en este input
    PropTypes.string,
    PropTypes.number
  ])

};

export default StyledInput;
