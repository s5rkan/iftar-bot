## Iftar bot iyi kullanımlar.

### Öylesine Metin:
#### Biliyorsunuz yakın zamanda ramazan yaklaşıyor oruçlar tutulacak benimde boş zamanım vardı bir şeylerle uğraşıyım diye böyle bir sistem yapmak istedim umarım işinize yarar.

<hr />

### Kurulum:
#### Not: Bilgisayarınızda node.js kurulu olması gerekiyor. (Kurulu değilse indirme linki https://nodejs.org)
#### 1 - Bir terminal açın ve `npm install yarn --g` yazın yüklenmesini bekleyin.
#### 2 - Altyapı dosyası içinde terminal açın `yarn install` yazın ve bütün gerekli modülleri yükleyin.
#### 3 - Modülleri yükledikten sonra src klasörünün içinde bulunan config.js dosyasını doldurun.
#### 4 - Üsteki 3 maddeyi yaptıktan sonra `start.bat` adlı dosyayı açın ve botunuz aktif bir şekilde çalışacaktır.

<hr />

### Örnek config.js Dosyası:
```js
module.exports = {
  Prefix: "", // Bot ön ek yani prefixi komutları kullanabilmek için.
  Token: "", // Bot anahtarı yani tokeni discorda giriş yapması için kullanılır.
  GuildID: "", // Sunucu ID'si.
  VoiceChannelID: "", // İftar vakti bağlanıcağı ses kanalının ID'si.
  EzanInfoChannelID: "", // Ezan (İftar) saati duyuru yapacağı metin kanalının ID'si.
  SehirIsmi: "", // Varsayılan olarak küçük harflerle şehir ismi yazılmalıdır.
  API_KEY: "", // https://collectapi.com/tr/api/pray/namaz-vakitleri-api üzerinden api key alabilirsiniz (Siteye giriş yapmanız gerekiyor.).
};
```


