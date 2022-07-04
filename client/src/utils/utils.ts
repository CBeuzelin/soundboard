export default class Utils {
  private static doesFileExists(url: string) {
    const http = new XMLHttpRequest();

    http.open('HEAD', url, false);
    http.send();

    return http.status !== 404;
  }

  public static fetchFile(url: string): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      if (Utils.doesFileExists(url)) {
        return fetch(url)
          .then((r) => r.blob())
          .then((blob) => resolve(blob))
          .catch(() => reject());
      }

      return reject();
    });
  }
}
