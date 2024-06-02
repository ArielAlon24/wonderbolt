import { evalTS } from "../lib/utils/bolt";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { modifySrt, Options } from "./srt";

const Main: React.FC = () => {
  const [removePunctuation, setRemovePunctuation] = useState<boolean>(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRemovePunctuation(event.target.checked);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    var filename = "kaps-launching.srt";
    const path = await evalTS("getMediaPath", filename);
    if (path) {
      modifySrt(path, {removePunctuation: removePunctuation});
    } else {
      alert("Internal server error!");
      return;
    }
    evalTS("addCaptions", filename);
  };

  return (
    <div id="plugin_section" className="mt-3 flex flex-col items-center justify-center h-full w-full">
			<span className="text- font-bold text-center text-white">
				Wonderful
			</span>
			<form id="addCaptions" onSubmit={handleSubmit}>
        <br/>
        <input
          className="mr-4"
          type="checkbox"
          id="removePunctuation"
          name="removePunctuation"
          checked={removePunctuation}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="removePanctuation" className="font-bold text-center text-white">Remove Punctuation</label>
        <br/>
        <input type="submit" value="Add Kraoke Captions" className="bg-blue-500 hover:bg-blue-700 mt-6 text-white font-bold py-2 px-4 rounded"/>
      </form>
		</div>
  );
};
export default Main;
