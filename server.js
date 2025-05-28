const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/uuid/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    if (!response.ok) throw new Error('User not found');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch UUID' });
  }
});

app.get('/skin/:uuid', async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    if (!response.ok) throw new Error('Failed to fetch skin data');
    const data = await response.json();
    const textureProperty = data.properties.find(prop => prop.name === 'textures');
    const texture = JSON.parse(Buffer.from(textureProperty.value, 'base64').toString());
    res.json({ skinURL: texture.textures.SKIN.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Skin Data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
