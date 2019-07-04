function appSettings(props){
  let screenWidth = props.settingsStorage.getItem("screenWidth");
  let screenHeight = props.settingsStorage.getItem("screenHeight");
  return (
    <Page>
      <Section title={<Text bold align="center">General</Text>}>
        <Toggle settingsKey="ShowBattBar" label="Show Battery Status"/>
        <Toggle settingsKey="ShowBattPct" label="Show Battery Percentage"/>
        <Toggle settingsKey="ShowUTC" label="Show UTC Clock"/>
      </Section>
      <Section title={<Text bold align="center">Background</Text>}>
        <Toggle settingsKey="ShowBg" label="Show Background Image"/>
        <ImagePicker
          title="Background Image"
          description="Pick an image to use as a background"
          label="Background Image"
          settingsKey="bgImage"
          imageWidth={screenWidth}
          imageHeight={screenHeight}
        />
        <Slider
          label="Background Image Opacity"
          settingsKey="bgOpacity"
          min="0"
          max="1"
          step="0.1"
        />
      </Section>
      <Section title={<Text bold align="center">Text Color</Text>}>
        <Slider
          settingsKey="fgColorR"
          label="R"
          min="0"
          max="255"
          step="8"
        />
        <Slider
          settingsKey="fgColorG"
          label="G"
          min="0"
          max="255"
          step="4"
        />
        <Slider
          settingsKey="fgColorB"
          label="B"
          min="0"
          max="255"
          step="8"
        />
      </Section>
    </Page>
  );
}
registerSettingsPage(appSettings);